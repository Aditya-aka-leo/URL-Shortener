const zookeeper = require('node-zookeeper-client');

var client = zookeeper.createClient('zookeeper:2181')


range = {
    start:0,
    cur: 0,
    end:0
};
const hash_gen = (num) => {
    const s = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let hash_str = '';

    while (num > 0) {
        hash_str = s[num % 62] + hash_str;
        num = Math.floor(num / 62);
    }
    return hash_str;
};

let create_token = async () =>
{
    client.create(
        '/token',
        Buffer.from('1000000'),
        zookeeper.CreateMode.PERSISTENT,
        function (error, path) {
            if (error) {
                console.log(error.stack);
                return;
            }
    
            console.log('Node: %s is created.', path);
        }
    );    
}

let token_exist = async () =>
{
    client.exists('/token', function (error, stat) {
        if (error) {
            console.log(error.stack);
            return;
        }
    
        if (stat) {
            console.log('Node exists.');
        } else {
            create_token();
        }
    });
}
let set_token_rage = async(token) =>
{
    client.setData('/token',Buffer.from(String(token)), function (error, stat) {
        if (error) {
            console.log(error.stack);
            return;
        }
        console.log('Data is set.');
    });
}
let create_token_range = ()=>
{
    console.log('create_token_range is called');
    client.getData(
        '/token',
        function (event) {
            console.log('Got event: %s.', event);
        },
        function (error, data, stat) {
            if (error) {
                console.log(error.stack);
                console.log("there is some error with toke");
                return;
            }
            console.log('its here');
            range.start = parseInt(data.toString());
            range.cur = range.start;
            range.end = parseInt(data.toString())+1000000;
            console.log(range.start);
            console.log("Start range",range.start);
            console.log("Cur : ",range.cur);
            console.log("end : ",range.end);
            set_token_rage(range.end);
            return range;
        }
    )
}

let removeToken = async () => {
    client.remove('/token', (error, stat) => {
        if (error) {
            console.log(error.stack)
            return
        }

        console.log('Node is deleted.')
    })
}
zk_connect_sv = async ()=>
{
    client.once('connected', async () => {
        console.log('Connected to the server.');
        await token_exist();
        await create_token_range();
    console.log("Start range",range.start);
    console.log("Cur : ",range.cur);
    console.log("end : ",range.end);
    });
    client.connect();
}

module.exports = {zk_connect_sv,removeToken,create_token_range,set_token_rage,token_exist,create_token,hash_gen,range};
