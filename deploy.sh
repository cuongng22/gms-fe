cp /opt/certificate/crewtrip_certificate.pem ./crewtrip_certificate.pem
cp /opt/certificate/private.key ./private.key

docker-compose down

docker-compose up --build -d

docker image prune -f
