// transform an FESM2015 input file to UMD
// because it is required in `ddp-study-server\study-builder\tenants\atcp\pages\login.html`
// in <script> tag

export default {
    input: 'projects/ddp-atcp/src/auth0/compiled/auth0-scripts/fesm2015/ddp-atcp-auth.mjs',
    output: {
        file: 'projects/ddp-atcp/src/auth0/compiled/auth0-scripts/bundles/ddp-atcp-auth.umd.js',
        format: 'umd',
        name: 'ddp-atcp-auth'
    }
};
