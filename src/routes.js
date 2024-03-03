
export default function router(routes) {
  
    //Group 1: User Auth Api-Endpoint
    routes.group('/api/user/auth', app => app
        .post('/logout', () => "logout Route")
    );

}