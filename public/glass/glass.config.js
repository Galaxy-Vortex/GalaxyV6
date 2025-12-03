/*global Ultraviolet*/
self.__uv$config = {
    prefix: '/uv/service/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/glass/glass.handler.js',
    client: '/glass/glass.client.js',
    bundle: '/glass/glass.bundle.js',
    config: '/glass/glass.config.js',
    sw: '/glass/glass.sw.js',
};
