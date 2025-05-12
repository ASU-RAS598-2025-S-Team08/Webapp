
## 🚀 How to Use the Webapp

1. Clone and build the workspace:

```bash
mkdir ~/webapp/
cd ~/webapp/
git clone https://github.com/ASU-RAS598-2025-S-Team08/Webapp.git
```

2. Stream data (We used FastDDS to get the data):

```bash
ros2 launch rosbridge_server rosbridge_websocket_launch.xml
```

3. Run backend:

```bash
cd ~/webapp/backend/
node server.js
```

4. Run frontend:

```bash
cd ~/webapp/frontend/
npm run dev
```

---
