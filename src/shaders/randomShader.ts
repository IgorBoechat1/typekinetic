const randomShader = `

void mainImage( out vec4 O, in vec2 F )
{
    vec2 R = iResolution.xy,
        st = (2.0 * F - R)/R.y;
    st *= 0.35;
    st = st*0.21 - st.y*0.1 + fbmL(st*1.5 - iTime*0.0125 + st.x*0.1 + fbmL(st*3.0 + iTime*0.05));
    vec3 C = SS(15.0, -0.05, (length(st)-0.05)/fwidth(length(st)-0.05))*vec3(0,1,1);
    O = vec4(gamma(C),1.0);
}
`;

export default randomShader;