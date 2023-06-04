working with webpack:
npm run buildfe - build the project front
npm run serverfe - run server for project front
npm run predeploy - build the project to as preparation to deploy it to gh-pages
npm run deploy - deploy the project to gh pages, auto starts predeploy first (do not forget to check the folder to deploy, default - dist)

npm run startbe - start the project back
npm run serverbe - run server for project back

npm run dev - start back server + front server

npm run deploy_old - deploy the project to gh pages using react builder, auto starts predeploy first (need to rename predeploy_old)



//aspect-ratio: 4*3

//max for all: 2000*1500

//colors sizes: 2000*1500, 1050*800, 700*525, 400*300, 40*30
//carousel_Max: 800*400, 500*250

codes: 
0: Errors in data during registration
1: User already exists
2: User created
3: Something wrong with server, try again later
