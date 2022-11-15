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

  constructor(apiKey: string, apiHost: string) {
    const apiConfiguration: Configuration = new Configuration({
      accessToken: `${apiKey}`,
      basePath: `https://${apiHost}/v1`,
    });

    this.customDomains = new CustomDomainsApi(apiConfiguration);
    this.deploys = new DeploysApi(apiConfiguration);
    this.jobs = new JobsApi(apiConfiguration);
    this.owners = new OwnersApi(apiConfiguration);
    this.services = new ServicesApi(apiConfiguration);
  }
}
