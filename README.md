# Website for recording purchase history

## Server configuration file
- PORT - TCP port number
- SOCKET - name of unix socket. If both SOCKET and PORT are defined then server listens on unix socket
- MONGO_URI - uri of mongodb e.g: "mongodb://host:port/database"
- MONGO_USER - mongodb user
- MONGO_PASSWORD - mongodb user's password
- JWT_SECURE_KEY - key for token signing
- JWT_EXPIRE_TIME - token's expire time
- JWT_ALGO - algorithm user to sign token
- SALT_ROUNDS - number of rounds in salting process

## Client configuration file
- REACT_APP_ADDRESS - address of server
