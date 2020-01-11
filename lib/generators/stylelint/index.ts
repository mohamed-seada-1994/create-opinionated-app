import path from 'path'
import { AppType, ProjectType } from 'state.types'
import { json } from 'services/json'
import { generate } from 'services/generator'
import { addDependencies } from 'services/exec'

const moduleName = 'stylelint'

interface IContext {
  projectType: ProjectType
  appType: AppType
  projectFolder: string
}

export const addStylelint = async (context: IContext) => {
  const lintCssNEXT = 'stylelint \'pages/**/*.{ts,tsx}\''
  const lintCssOther = 'stylelint \'**/*.{ts,tsx}\''
  const lintCss = context.projectType === ProjectType.NEXT ? lintCssNEXT : lintCssOther

  const dependenciesShared = ['stylelint', 'prettier', 'stylelint-config-prettier']
  const dependenciesMobile = ['@code-quality/stylelint-styled-components-react-native-config']
  const dependenciesWeb = ['@code-quality/stylelint-styled-components-config']
  const dependencies = [...dependenciesShared, ...(context.appType === AppType.MOBILE ? dependenciesMobile : dependenciesWeb)]

  await json.update('package.json')(
    {
      projectName: context.projectFolder,
      message: '[json] adding lint:css to scripts',
      messageSuccess: '[json] add "lint:css" to scripts',
    },
    jsonFile => ({
      ...jsonFile,
      scripts: {
        ...jsonFile.scripts,
        'lint:css': lintCss,
      },
    }),
  )

  await addDependencies('stylelint', dependencies, true)

  return generate({
    name: moduleName,
    source: path.join('templates', context.appType),
    destination: '.',
  })
}
