# Emulator

### Emulator.js
## To do

### Main
- [✔] convert values [[[0, 0, 0], [255, 255, 255] ...]] to {0: 0, 1: 255, 2: ... }
- [✔] (BUG) values[x][y] = [255, 0, 0]  ----   [255, 0, 0] -> {0: 255, 1: 0, 2: 0} FIX - js array gives reference doesnt copy 
- Somehow copy [255, 255, 0] (common function can fix this [lower task])
- add functions that are commonly used, such as setRow, setColumn etc.
- [✔] on IPC 'stop' change button state
- add my codes to list of codes
- make saving automatic, easy title, no looking for files on disc. Always in one place
- admin mode for emulator, we can easily verify codes etc
- USOS / Kampus token like login for sending, get token, save token
- cubic Bézier curves in vm (https://medium.com/better-programming/smooth-scrolling-with-javascript-a4cd787e447f)
- find a animation js library to add to vm
- change name to CodeMyInstitute

### [ ledserver ] <=> [ jsvmserver ]
#### Make connection secure!
- send admin token 

### Redux
- add Axios api calls
- last saved codes 
- add socket for live mode
- add ipc for local mode

### IPC communication
- add load code 
- add save code (not save as)
- add last saved codes

### Electron
#### VM not as a fork (process), to slow, no one will want to install redis
- Convert to multiple files
1. file IPC communication
2. file Menu
- load from local file
- Menu
1. save / save as / load / new 
- add small local database for last files etc (https://github.com/kripken/sql.js/)

### Queue
- (BUG) Fade in / Fade out overwrites dmxValues (values) => FIX this by making a local copy
- If no internet or communication, add to queue a default animation
- (BUG) If ledserver stops working during the queue, it crashes => FIX this by checking if queue length is 0, if so, add a default animation
- if error is thrown, send request to django (as an admin) that it is not verified and add it to error_codes table

### Design
- svg design
- on segment hover show x, y, color (if segement is not on instutute, give additional infomation)
- live mode button with gradient background (https://codepen.io/Katiae/pen/wdXpOY)
- kinect / dmx icons
- When live animate in little people
- bulma dark theme (https://jenil.github.io/bulmaswatch/help/)
- add loader from bulma with icon from dribbble (https://dribbble.com/shots/9776794-Baby-editor)
- segments that dont work, add onhover information

### package.json
- [✔] add electron-dev-windows with (SET ... & npm ... )
- [✔] update react-scripts to 3.4.0

## .env (Not implemented yet)
REST_BACKEND_URL=
REST_BACKEND_PORT=

QUEUE_BACKEND_URL=
QUEUE_BACKEND_PORT=

FRONT_END_URL=
FRONT_END_PORT=

IS_ELECTRON=
HAS_LOCAL_QUEUE=