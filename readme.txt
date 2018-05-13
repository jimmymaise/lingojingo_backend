docker build -t aznode/wallet-master-api .

docker run --name aznode-wallet-master-api -it -p 3800:3800 -e DB_SERVERS="mongodb://walltetmaster_admin:g8E[FML{VAtmyn3C@ds029224.mlab.com:29224/aznode-walltet-master" -d aznode/wallet-master-api

vi /etc/nginx/conf.d/wallet-master-api.aznode.com.conf


# Move Docker
docker save -o <save image to path> <image name>
docker save -o aznode_wallet-master-api.tar aznode/wallet-master-api

docker load -i <path to image tar file>