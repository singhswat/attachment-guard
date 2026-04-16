import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';

const resolver = new Resolver();

// GET config
resolver.define('getConfig', async ({ context }) => {
  const projectKey = context.extension.project.key;

  const response = await api.asApp().requestJira(
    route`/rest/api/3/project/${projectKey}/properties/project-classification`
  );

  if (response.status === 200) {
    const data = await response.json();
    return data.value;
  }

  return {
    classification: "LOW-TECH PROJECT",
    message: "Uploading technical files is not permitted."
  };
});

// SAVE config
resolver.define('saveConfig', async ({ context, payload }) => {
  const projectKey = context.extension.project.key;

  await api.asApp().requestJira(
    route`/rest/api/3/project/${projectKey}/properties/project-classification`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  return { success: true };
});

export const handler = resolver.getDefinitions();