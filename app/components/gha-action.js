import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { Octokit } from "@octokit/core";
import environment from 'gha/config/environment';

export default class GhaActionComponent extends Component {
    @tracked octokit = new Octokit({
        auth: environment.EmberENV.GITHUB_TOKEN
      })

    @tracked workflows = null;

    @action
    async getGHAAction(){
        const workflowsData = await this.octokit.request('GET /repos/{owner}/{repo}/actions/workflows{?per_page,page}', {
            owner: 'mariiapaniutina',
            repo: 'gha-test'
          })
        this.workflows = workflowsData.data.workflows;
        console.log('----this.workflows', this.workflows)
    }
}
