import { PursonalServer } from "./server";
import { Config } from "./config";
import { ArgumentParser } from "argparse";

//let ArgumentParser = argparse.ArgumentParser;
let parser = new ArgumentParser({
    version: "0.0.1",
    addHelp: true,
    description: "Argparse example"
});
parser.addArgument(
    ["-p", "--port"],
    {
        help: "The port to use",
        defaultValue: 80
    }
);
var args = parser.parseArgs();
let server: PursonalServer = new PursonalServer(args.port);
server.start();