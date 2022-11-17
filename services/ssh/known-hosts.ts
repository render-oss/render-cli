import { FS } from "../../deps.ts";

import { Region } from "../../config/types/enums.ts";
import { getLogger } from "../../util/logging.ts";
import { getPaths } from "../../util/paths.ts";


export type SSHEndpointInfo = Readonly<{
  pubKey: string,
}>;

export const SSH_ENDPOINT_KEYS: Readonly<Record<Region, SSHEndpointInfo>> = {
  ohio: {
    pubKey: "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINMjC1BfZQ3CYotN1/EqI48hvBpZ80zfgRdK8NpP58v1",
  },
  frankfurt: {
    pubKey: "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILg6kMvQOQjMREehk1wvBKsfe1I3+acRuS8cVSdLjinK",
  },
  oregon: {
    pubKey: "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFON8eay2FgHDBIVOLxWn/AWnsDJhCVvlY1igWEFoLD2",
  },
  singapore: {
    pubKey: "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGVcVcsy7RXA60ZyHs/OMS5aQj4YQy7Qn2nJCXHz4zLA",
  },
};

const SSH_SERVER_REGEX = RegExp(
  "^ssh.(?<region>(" +
  Object.keys(SSH_ENDPOINT_KEYS).join("|") +
  ")).render.com",
);

export async function updateKnownHosts(path?: string) {
  // this fn is written as it is because if we don't actually change known_hosts,
  // we don't want to update the one that the user already has (because a change in
  // mtime can trigger security stuff in some endpoint protection).
  const p = path ?? `${(await getPaths()).sshDir}/known_hosts`;  

  const logger = await getLogger();
  const file = await Deno.readTextFile(p);
  const lines = file.split("\n");
  const outLines: Array<string> = [];
  
  let regions = Object.keys(SSH_ENDPOINT_KEYS);
  let changesMade = false;
  
  lines.forEach(line => {
    const match = SSH_SERVER_REGEX.exec(line);

    if (line.length === 0 || !match) {
      outLines.push(line);
      return;
    }

    const region = match.groups?.region;
    if (!region) {
      // should never actually hit this, given the regex
      throw new Error("firewall: bad ssh known_hosts match");
    }

    const [host, ...rest] = line.split(" ");
    const key = rest.join(' ');
    
    const knownKey = SSH_ENDPOINT_KEYS[region as Region].pubKey;
    if (key?.trim() !== knownKey) {
      logger.warning(`Incorrect SSH pubkey found for '${host}'; was '${key}', updated to '${knownKey}'.`);
      outLines.push(`${host} ${knownKey}`);
      changesMade = true;
    }

    regions = regions.filter(r => r === region);
  });

  logger.debug(`Regions not in known hosts: ${regions.join(' ')}`);

  for (const region of regions) {
    const { pubKey } = SSH_ENDPOINT_KEYS[region as Region];
    changesMade = true;

    const newLine = `ssh.${region}.render.com ${pubKey}`;
    logger.info("Appending to known_hosts:", newLine);
    outLines.push(newLine);
  }

  if (changesMade) {
    logger.info(`Updating '${p}'. Copying old to '${p}.old'.`);
    await FS.copy(p, `${p}.old`, { overwrite: true });
    await Deno.writeTextFile(p, outLines.join("\n"));
  } else {
    logger.debug("No updates to known_hosts.");
  }
}
