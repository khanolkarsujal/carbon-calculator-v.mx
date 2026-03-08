import * as fs from "fs";
const test = async () => {
    const res1 = await fetch("https://api.carbonintensity.org.uk/generation/pt24h");
    const data1 = await res1.json();
    fs.writeFileSync("api_test2.json", JSON.stringify(data1.data?.slice(0, 3) || data1, null, 2));
};
test();
