import { generate } from 'services/generator'
import { addDependencies } from 'services/exec'
import { json } from 'services/json'
import { ProjectType } from 'state.types'

const moduleName = 'heroku'

interface IContext {
  projectType: ProjectType
  projectFolder: string
  projectName: string
}

export const addHerokuWeb = async (context: IContext) => {
  await json.update('package.json')(
    {
      projectName: context.projectFolder,
      message: '[json] adding heroku scripts',
      messageSuccess: '[json] add heroku scripts',
    },
    jsonFile => ({
      ...jsonFile,
      scripts: {
        ...jsonFile.scripts,
        'heroku-postbuild': 'npm run build',
      },
    }),
  )

  await generate({
    name: moduleName,
    source: 'templates/web',
    destination: '.',
    context,
  })

  if (context.projectType === ProjectType.CRA) {
    await addDependencies('serve', ['serve'])
    await json.update('package.json')(
      {
        projectName: context.projectFolder,
        message: '[json] adding heroku scripts',
        messageSuccess: '[json] add heroku scripts',
      },
      jsonFile => ({
        ...jsonFile,
        scripts: {
          ...jsonFile.scripts,
          'start': 'node node_modules/.bin/serve -s build',
        },
      }),
    )
  }
}
