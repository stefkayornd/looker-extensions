import { ILook } from '@looker/sdk'

export const mockSdk = {
  all_looks: async () =>
    [
      {
        id: '1',
        title: 'Mock Look 1',
        description: 'A mock look',
        model: { id: 'home-staging', label: 'Home-staging' },
        image_embed_url: '',
      },
      {
        id: '2',
        title: 'Mock Look 2',
        description: 'Another mock look',
        model: {
          id: 'revenue-staging',
          label: 'Revenue-staging',
        },
        image_embed_url: '',
      },
      {
        id: '4',
        title: 'Mock Look 3',
        description: 'Yet another mock look',
        model: {
          id: 'revenue-staging',
          label: 'Revenue-staging',
        },
        image_embed_url: '',
      },
      {
        id: '3',
        title: 'Mock Look 4',
        description: 'Yet another mock 4',
        model: { id: 'home-staging', label: 'Home-staging' },
        image_embed_url: '',
      },
    ] as ILook[],
  ok: async (promise: Promise<ILook[]>) => promise,
}
