import { routes } from './okaps-routing.module';

describe('AppRoutingModule', () => {
  it('should contain a home route', () => {
    const route = routes.find((x) => x.path === '');
    expect(route).toBeTruthy();
  });
});
