import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';

const resolver = new Resolver();

resolver.define('getIssueData', async ({ context }) => {
  const projectKey = context.extension.project.key;

  // Fetch project properties
  const response = await api.asApp().requestJira(
    route`/rest/api/3/project/${projectKey}/properties/project-classification`
  );

  let config = {};

  if (response.status === 200) {
    const data = await response.json();
    config = data.value;
  }

  return {
    projectKey,
    classification: config.classification || "STANDARD",
    message: config.message || "Standard attachment policy applies."
  };
});

export const handler = resolver.getDefinitions();