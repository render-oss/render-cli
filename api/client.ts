import { apiHost, apiKeyOrThrow } from '../commands/_helpers.ts';
import { RuntimeConfiguration } from '../config/types/index.ts';
import { 
  Configuration, 
  CustomDomainsApi,
  DeploysApi,
  JobsApi,
  OwnersApi,
  ServicesApi,
} from '../_openapi/generated/index.ts';

export class APIClient {
  // TODO: this isn't sustainable, we need to rework this into the templates
  readonly customDomains: CustomDomainsApi;
  readonly deploys: DeploysApi;
  readonly jobs: JobsApi;
  readonly owners: OwnersApi;
  readonly services: ServicesApi;

  constructor(cfg: RuntimeConfiguration) {
    const host = apiHost(cfg);
    const key = apiKeyOrThrow(cfg);

    const apiConfiguration: Configuration = new Configuration({
      apiKey: key,
      basePath: `https://${host}`,
    });

    this.customDomains = new CustomDomainsApi(apiConfiguration);
    this.deploys = new DeploysApi(apiConfiguration);
    this.jobs = new JobsApi(apiConfiguration);
    this.owners = new OwnersApi(apiConfiguration);
    this.services = new ServicesApi(apiConfiguration);
  }
}
