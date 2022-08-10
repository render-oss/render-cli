import { Region } from "../config/types/enums.ts";
import { getLogger } from "../util/logging.ts";

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

export async function updateKnownHosts(path?: string) {
  const logger = await getLogger();
  logger.warning("TODO: implement updateKnownHosts");
  // TODO: actually implemenger
}
