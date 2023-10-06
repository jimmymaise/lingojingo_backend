docker build -t aznode/wallet-master-api .

docker run --name aznode-wallet-master-api -it -p 3800:3800 -e DB_SERVERS="mongodb://" -d aznode/wallet-master-api

vi /etc/nginx/conf.d/wallet-master-api.aznode.com.conf


# Move Docker
docker save -o <save image to path> <image name>
docker save -o aznode_wallet-master-api.tar aznode/wallet-master-api

docker load -i <path to image tar file>
