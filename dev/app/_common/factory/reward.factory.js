export function RewardFactory($resource, baseUrl) {
  'ngInject';

  return $resource(
    baseUrl + 'reward/:id/view',
    {id: "@id"},
    {
      list: {
        url: baseUrl + 'reward/index',
        method: 'GET',
        isArray: true
      },
      create: {
        url: baseUrl + 'reward/create',
        method: 'POST'
      },
      delete: {
        url: baseUrl + 'reward/:id/delete',
        method: 'DELETE'
      },
      update: {
        url: baseUrl + 'reward/:id/update',
        method: 'PUT'
      }
    }
  );
}