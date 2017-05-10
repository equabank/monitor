# Run Harness stack

## Start selenium standalone
```
java -Dwebdriver.chrome.driver=chromedriver2.26 -jar selenium-server-standalone-3.2.0.jar
```

## Run Harness docker image
```
docker run -it --name harness -v `PWD`/tests/functionTests/:/home/harness rdpanek/docker_harness:1.6
```

## Run tests in Docker container
```
harness homepage -c localChrome -t 25000 -b
```
