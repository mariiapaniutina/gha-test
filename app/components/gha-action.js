import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { Octokit } from "@octokit/core";
import environment from 'gha/config/environment';

export default class GhaActionComponent extends Component {
    //NOTE :: we need GITHUB_TOKEN for read and PAT for read/write
    @tracked octokit = new Octokit({
        auth: environment.EmberENV.GITHUB_TOKEN
      })

    @tracked workflows = null;
    @tracked workflowsSHARuns = null;

    @action
    async getGHAWorkflows(){
        const runsData = await this.octokit.request('GET /repos/{owner}/{repo}/actions/runs', {
          owner: 'mariiapaniutina',
          repo: 'gha-test',
        })
        console.log('-----runsData', runsData)
        this.workflows = runsData.data.workflow_runs.reduce((allRuns, currRun) => {
          const name = currRun.name;
          if (allRuns[name]) {
            allRuns[name].runs.push(currRun)
          } else {
            allRuns[name] = {
              runs: [currRun],
              name: name,
              id: currRun.workflow_id
            }
          }
          return allRuns;
        }, {})

        console.log('-----this.workflows', this.workflows)

        //NOTE :: get list of all workflows by associated SHA
        const customSHARuns = await this.octokit.request('GET /repos/{owner}/{repo}/actions/runs{?actor,branch,event,status,per_page,page,created,exclude_pull_requests,check_suite_id,head_sha}', {
          owner: 'mariiapaniutina',
          repo: 'gha-test',
          head_sha: 'e2dc78e2633544c84c991a1878ac32c95b9770b3'
        })
        this.workflowsSHARuns = customSHARuns.data.workflow_runs;
    }

    @action
    async onDeployWorkflow(WORKFLOW_ID){
        const deploy = await this.octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
          owner: 'mariiapaniutina',
          repo: 'gha-test',
          workflow_id: WORKFLOW_ID,
          ref: 'main',
          // inputs: {
          //   name: 'usererrer',
          // }
        })

        console.log('------deploy', deploy)
    }
}
