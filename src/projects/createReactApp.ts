import { prompt } from 'inquirer'
import { addBrowserlist } from 'packages/browserslist'
import { initReactApp } from 'packages/_CreateReactApp'
import { addEditorconfig } from 'packages/editorconfig'
import { setUpGitHooks } from 'packages/git/hooks'
import { addFilesToGit } from 'packages/git/add'
import { addPrettier } from 'packages/prettier'
import { addStylelint } from 'packages/stylelint'
import { addEslint } from 'packages/eslint'
import { addCypress } from 'packages/cypress'
import { addHerokuWeb } from 'packages/heroku'
import { DeploymentType, IMainState, ProjectType } from 'state.types'

export const createReactApp = async (context: IMainState) => {
  const { isCypress } = await prompt({
    name: 'isCypress',
    type: 'list',
    message: 'Do you want to use cypress?',
    choices: [
      { name: 'No', value: false },
      { name: 'Yes', value: true },
    ],
  })

  const { deploymentType } = await prompt({
    name: 'deploymentType',
    type: 'list',
    message: 'Do you want to generate CD configuration?',
    choices: [
      { name: 'No', value: DeploymentType.NONE },
      { name: 'Heroku', value: DeploymentType.HEROKU },
    ],
  })
  const isHeroku = deploymentType === DeploymentType.HEROKU

  // Init app
  await initReactApp({
    projectFolder: context.projectFolder,
    projectName: context.projectName,
    isCypress,
    isHeroku,
  })

  if (isCypress) {
    await addCypress({ projectFolder: context.projectFolder, projectName: context.projectName })
  }

  // Code quality tools
  await addEditorconfig()
  await addBrowserlist()
  await addPrettier({ projectFolder: context.projectFolder })
  await addStylelint({
    appType: context.appType,
    projectFolder: context.projectFolder,
  })
  await addEslint({ appType: context.appType, projectFolder: context.projectFolder })

  // Git hooks
  await setUpGitHooks()

  if (isHeroku) {
    await addHerokuWeb({
      projectName: context.projectName,
      projectFolder: context.projectFolder,
      projectType: ProjectType.CRA,
    })
  }

  // Commit and share on GitHub
  await addFilesToGit({ projectFolder: context.projectFolder })
}
