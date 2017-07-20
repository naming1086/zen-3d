(function(){
zen3d.ShaderChunk = {
ambientlight_pars_frag: "uniform vec4 u_AmbientLightColor;",
begin_frag: "vec4 outColor = vec4(u_Color, u_Opacity);",
begin_vert: "vec3 transformed = vec3(a_Position);\n#if defined(USE_NORMAL) || defined(USE_ENV_MAP)\n    vec3 objectNormal = vec3(a_Normal);\n#endif",
bsdfs: "\nvec4 BRDF_Diffuse_Lambert(vec4 diffuseColor) {\n    return RECIPROCAL_PI * diffuseColor;\n}\nvec4 F_Schlick( const in vec4 specularColor, const in float dotLH ) {\n\tfloat fresnel = pow( 1.0 - dotLH, 5.0 );\n\treturn ( 1.0 - specularColor ) * fresnel + specularColor;\n}\nfloat D_BlinnPhong( const in float shininess, const in float dotNH ) {\n\treturn RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );\n}\nfloat G_BlinnPhong_Implicit( ) {\n\treturn 0.25;\n}\nvec4 BRDF_Specular_BlinnPhong(vec4 specularColor, vec3 N, vec3 L, vec3 V, float shininess) {\n    vec3 H = normalize(L + V);\n    float dotNH = saturate(dot(N, H));\n    float dotLH = saturate(dot(L, H));\n    vec4 F = F_Schlick(specularColor, dotLH);\n    float G = G_BlinnPhong_Implicit( );\n    float D = D_BlinnPhong(shininess, dotNH);\n    return F * G * D;\n}",
bumpMap_pars_frag: "#ifdef USE_BUMPMAP\n\tuniform sampler2D bumpMap;\n\tuniform float bumpScale;\n\tvec2 dHdxy_fwd(vec2 uv) {\n\t\tvec2 dSTdx = dFdx( uv );\n\t\tvec2 dSTdy = dFdy( uv );\n\t\tfloat Hll = bumpScale * texture2D( bumpMap, uv ).x;\n\t\tfloat dBx = bumpScale * texture2D( bumpMap, uv + dSTdx ).x - Hll;\n\t\tfloat dBy = bumpScale * texture2D( bumpMap, uv + dSTdy ).x - Hll;\n\t\treturn vec2( dBx, dBy );\n\t}\n\tvec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy) {\n\t\tvec3 vSigmaX = dFdx( surf_pos );\n\t\tvec3 vSigmaY = dFdy( surf_pos );\n\t\tvec3 vN = surf_norm;\n\t\tvec3 R1 = cross( vSigmaY, vN );\n\t\tvec3 R2 = cross( vN, vSigmaX );\n\t\tfloat fDet = dot( vSigmaX, R1 );\n\t\tvec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n\t\treturn normalize( abs( fDet ) * surf_norm - vGrad );\n\t}\n#endif\n",
common_frag: "uniform mat4 u_View;\nuniform float u_Opacity;\nuniform vec3 u_Color;\nuniform vec3 u_CameraPosition;",
common_vert: "attribute vec3 a_Position;\nattribute vec3 a_Normal;\n#include <transpose>\n#include <inverse>\nuniform mat4 u_Projection;\nuniform mat4 u_View;\nuniform mat4 u_Model;\nuniform vec3 u_CameraPosition;",
diffuseMap_frag: "#ifdef USE_DIFFUSE_MAP\n    vec4 texelColor = texture2D( texture, v_Uv );\n    texelColor = mapTexelToLinear( texelColor );\n    outColor *= texelColor;\n#endif",
diffuseMap_pars_frag: "#ifdef USE_DIFFUSE_MAP\n    uniform sampler2D texture;\n#endif",
directlight_pars_frag: "struct DirectLight\n{\n    vec3 direction;\n    vec4 color;\n    float intensity;\n    int shadow;\n    float shadowBias;\n    float shadowRadius;\n    vec2 shadowMapSize;\n};\nuniform DirectLight u_Directional[USE_DIRECT_LIGHT];",
emissiveMap_frag: "#ifdef USE_EMISSIVEMAP\n\tvec4 emissiveColor = texture2D(emissiveMap, v_Uv);\n\temissiveColor.rgb = emissiveMapTexelToLinear( emissiveColor ).rgb;\n\ttotalEmissiveRadiance *= emissiveColor.rgb;\n#endif",
emissiveMap_pars_frag: "#ifdef USE_EMISSIVEMAP\n\tuniform sampler2D emissiveMap;\n#endif",
encodings_frag: "gl_FragColor = linearToOutputTexel( gl_FragColor );",
encodings_pars_frag: "\nvec4 LinearToLinear( in vec4 value ) {\n\treturn value;\n}\nvec4 GammaToLinear( in vec4 value, in float gammaFactor ) {\n\treturn vec4( pow( value.xyz, vec3( gammaFactor ) ), value.w );\n}\nvec4 LinearToGamma( in vec4 value, in float gammaFactor ) {\n\treturn vec4( pow( value.xyz, vec3( 1.0 / gammaFactor ) ), value.w );\n}\nvec4 sRGBToLinear( in vec4 value ) {\n\treturn vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.w );\n}\nvec4 LinearTosRGB( in vec4 value ) {\n\treturn vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.w );\n}\nvec4 RGBEToLinear( in vec4 value ) {\n\treturn vec4( value.rgb * exp2( value.a * 255.0 - 128.0 ), 1.0 );\n}\nvec4 LinearToRGBE( in vec4 value ) {\n\tfloat maxComponent = max( max( value.r, value.g ), value.b );\n\tfloat fExp = clamp( ceil( log2( maxComponent ) ), -128.0, 127.0 );\n\treturn vec4( value.rgb / exp2( fExp ), ( fExp + 128.0 ) / 255.0 );\n}\nvec4 RGBMToLinear( in vec4 value, in float maxRange ) {\n\treturn vec4( value.xyz * value.w * maxRange, 1.0 );\n}\nvec4 LinearToRGBM( in vec4 value, in float maxRange ) {\n\tfloat maxRGB = max( value.x, max( value.g, value.b ) );\n\tfloat M      = clamp( maxRGB / maxRange, 0.0, 1.0 );\n\tM            = ceil( M * 255.0 ) / 255.0;\n\treturn vec4( value.rgb / ( M * maxRange ), M );\n}\nvec4 RGBDToLinear( in vec4 value, in float maxRange ) {\n\treturn vec4( value.rgb * ( ( maxRange / 255.0 ) / value.a ), 1.0 );\n}\nvec4 LinearToRGBD( in vec4 value, in float maxRange ) {\n\tfloat maxRGB = max( value.x, max( value.g, value.b ) );\n\tfloat D      = max( maxRange / maxRGB, 1.0 );\n\tD            = min( floor( D ) / 255.0, 1.0 );\n\treturn vec4( value.rgb * ( D * ( 255.0 / maxRange ) ), D );\n}\nconst mat3 cLogLuvM = mat3( 0.2209, 0.3390, 0.4184, 0.1138, 0.6780, 0.7319, 0.0102, 0.1130, 0.2969 );\nvec4 LinearToLogLuv( in vec4 value )  {\n\tvec3 Xp_Y_XYZp = value.rgb * cLogLuvM;\n\tXp_Y_XYZp = max(Xp_Y_XYZp, vec3(1e-6, 1e-6, 1e-6));\n\tvec4 vResult;\n\tvResult.xy = Xp_Y_XYZp.xy / Xp_Y_XYZp.z;\n\tfloat Le = 2.0 * log2(Xp_Y_XYZp.y) + 127.0;\n\tvResult.w = fract(Le);\n\tvResult.z = (Le - (floor(vResult.w*255.0))/255.0)/255.0;\n\treturn vResult;\n}\nconst mat3 cLogLuvInverseM = mat3( 6.0014, -2.7008, -1.7996, -1.3320, 3.1029, -5.7721, 0.3008, -1.0882, 5.6268 );\nvec4 LogLuvToLinear( in vec4 value ) {\n\tfloat Le = value.z * 255.0 + value.w;\n\tvec3 Xp_Y_XYZp;\n\tXp_Y_XYZp.y = exp2((Le - 127.0) / 2.0);\n\tXp_Y_XYZp.z = Xp_Y_XYZp.y / value.y;\n\tXp_Y_XYZp.x = value.x * Xp_Y_XYZp.z;\n\tvec3 vRGB = Xp_Y_XYZp.rgb * cLogLuvInverseM;\n\treturn vec4( max(vRGB, 0.0), 1.0 );\n}\n",
end_frag: "gl_FragColor = outColor;",
envMap_frag: "#ifdef USE_ENV_MAP\n    vec4 envColor = textureCube(envMap, v_EnvPos);\n    envColor = envMapTexelToLinear( envColor );\n    outColor += envColor * u_EnvMap_Intensity;\n#endif",
envMap_pars_frag: "#ifdef USE_ENV_MAP\n    varying vec3 v_EnvPos;\n    uniform samplerCube envMap;\n    uniform float u_EnvMap_Intensity;\n#endif",
envMap_pars_vert: "#ifdef USE_ENV_MAP\n    varying vec3 v_EnvPos;\n#endif",
envMap_vert: "#ifdef USE_ENV_MAP\n    v_EnvPos = reflect(normalize((u_Model * vec4(transformed, 1.0)).xyz - u_CameraPosition), (transpose(inverse(u_Model)) * vec4(objectNormal, 1.0)).xyz);\n#endif",
fog_frag: "#ifdef USE_FOG\n    float depth = gl_FragCoord.z / gl_FragCoord.w;\n    #ifdef USE_EXP2_FOG\n        float fogFactor = whiteCompliment( exp2( - u_FogDensity * u_FogDensity * depth * depth * LOG2 ) );\n    #else\n        float fogFactor = smoothstep( u_FogNear, u_FogFar, depth );\n    #endif\n    gl_FragColor.rgb = mix( gl_FragColor.rgb, u_FogColor, fogFactor );\n#endif",
fog_pars_frag: "#ifdef USE_FOG\n    uniform vec3 u_FogColor;\n    #ifdef USE_EXP2_FOG\n        uniform float u_FogDensity;\n    #else\n        uniform float u_FogNear;\n        uniform float u_FogFar;\n    #endif\n#endif",
inverse: "mat4 inverse(mat4 m) {\n    float\n    a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],\n    a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],\n    a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],\n    a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],\n    b00 = a00 * a11 - a01 * a10,\n    b01 = a00 * a12 - a02 * a10,\n    b02 = a00 * a13 - a03 * a10,\n    b03 = a01 * a12 - a02 * a11,\n    b04 = a01 * a13 - a03 * a11,\n    b05 = a02 * a13 - a03 * a12,\n    b06 = a20 * a31 - a21 * a30,\n    b07 = a20 * a32 - a22 * a30,\n    b08 = a20 * a33 - a23 * a30,\n    b09 = a21 * a32 - a22 * a31,\n    b10 = a21 * a33 - a23 * a31,\n    b11 = a22 * a33 - a23 * a32,\n    det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\n    return mat4(\n        a11 * b11 - a12 * b10 + a13 * b09,\n        a02 * b10 - a01 * b11 - a03 * b09,\n        a31 * b05 - a32 * b04 + a33 * b03,\n        a22 * b04 - a21 * b05 - a23 * b03,\n        a12 * b08 - a10 * b11 - a13 * b07,\n        a00 * b11 - a02 * b08 + a03 * b07,\n        a32 * b02 - a30 * b05 - a33 * b01,\n        a20 * b05 - a22 * b02 + a23 * b01,\n        a10 * b10 - a11 * b08 + a13 * b06,\n        a01 * b08 - a00 * b10 - a03 * b06,\n        a30 * b04 - a31 * b02 + a33 * b00,\n        a21 * b02 - a20 * b04 - a23 * b00,\n        a11 * b07 - a10 * b09 - a12 * b06,\n        a00 * b09 - a01 * b07 + a02 * b06,\n        a31 * b01 - a30 * b03 - a32 * b00,\n        a20 * b03 - a21 * b01 + a22 * b00) / det;\n}",
light_frag: "#ifdef USE_LIGHT\n    vec4 light;\n    vec3 L;\n    vec4 totalReflect = vec4(0., 0., 0., 0.);\n    vec4 diffuseColor = outColor.xyzw;\n    #ifdef USE_PHONG\n        vec4 specularColor = u_SpecularColor;\n    #endif\n    #ifdef USE_AMBIENT_LIGHT\n        totalReflect += RECIPROCAL_PI * diffuseColor * u_AmbientLightColor;\n    #endif\n    #if defined(USE_PHONG) && ( defined(USE_DIRECT_LIGHT) || defined(USE_POINT_LIGHT) || defined(USE_SPOT_LIGHT) )\n        vec3 V = normalize( (u_View * vec4(u_CameraPosition, 1.)).xyz - v_ViewModelPos);\n    #endif\n    #ifdef USE_DIRECT_LIGHT\n    for(int i = 0; i < USE_DIRECT_LIGHT; i++) {\n        L = -u_Directional[i].direction;\n        light = u_Directional[i].color * u_Directional[i].intensity;\n        L = normalize(L);\n        float dotNL = saturate( dot(N, L) );\n        vec4 irradiance = light * dotNL;\n        #ifdef USE_SHADOW\n            irradiance *= bool( u_Directional[i].shadow ) ? getShadow( directionalShadowMap[ i ], vDirectionalShadowCoord[ i ], u_Directional[i].shadowBias, u_Directional[i].shadowRadius, u_Directional[i].shadowMapSize ) : 1.0;\n        #endif\n        vec4 reflectLight = irradiance * BRDF_Diffuse_Lambert(diffuseColor);\n        #ifdef USE_PHONG\n            reflectLight += irradiance * BRDF_Specular_BlinnPhong(specularColor, N, L, V, u_Specular) * specularStrength;\n        #endif\n        totalReflect += reflectLight;\n    }\n    #endif\n    #ifdef USE_POINT_LIGHT\n    for(int i = 0; i < USE_POINT_LIGHT; i++) {\n        L = u_Point[i].position - v_ViewModelPos;\n        float dist = pow(clamp(1. - length(L) / u_Point[i].distance, 0.0, 1.0), u_Point[i].decay);\n        light = u_Point[i].color * u_Point[i].intensity * dist;\n        L = normalize(L);\n        float dotNL = saturate( dot(N, L) );\n        vec4 irradiance = light * dotNL;\n        #ifdef USE_SHADOW\n            vec3 worldV = (vec4(v_ViewModelPos, 1.) * u_View - vec4(u_Point[i].position, 1.) * u_View).xyz;\n            irradiance *= bool( u_Point[i].shadow ) ? getPointShadow( pointShadowMap[ i ], worldV, u_Point[i].shadowBias, u_Point[i].shadowRadius, u_Point[i].shadowMapSize ) : 1.0;\n        #endif\n        vec4 reflectLight = irradiance * BRDF_Diffuse_Lambert(diffuseColor);\n        #ifdef USE_PHONG\n            reflectLight += irradiance * BRDF_Specular_BlinnPhong(specularColor, N, L, V, u_Specular) * specularStrength;\n        #endif\n        totalReflect += reflectLight;\n    }\n    #endif\n    #ifdef USE_SPOT_LIGHT\n    for(int i = 0; i < USE_SPOT_LIGHT; i++) {\n        L = u_Spot[i].position - v_ViewModelPos;\n        float lightDistance = length(L);\n        L = normalize(L);\n        float angleCos = dot( L, -normalize(u_Spot[i].direction) );\n        if( all( bvec2(angleCos > u_Spot[i].coneCos, lightDistance < u_Spot[i].distance) ) ) {\n            float spotEffect = smoothstep( u_Spot[i].coneCos, u_Spot[i].penumbraCos, angleCos );\n            float dist = pow(clamp(1. - lightDistance / u_Spot[i].distance, 0.0, 1.0), u_Spot[i].decay);\n            light = u_Spot[i].color * u_Spot[i].intensity * dist * spotEffect;\n            float dotNL = saturate( dot(N, L) );\n            vec4 irradiance = light * dotNL;\n            #ifdef USE_SHADOW\n                irradiance *= bool( u_Spot[i].shadow ) ? getShadow( spotShadowMap[ i ], vSpotShadowCoord[ i ], u_Spot[i].shadowBias, u_Spot[i].shadowRadius, u_Spot[i].shadowMapSize ) : 1.0;\n            #endif\n            vec4 reflectLight = irradiance * BRDF_Diffuse_Lambert(diffuseColor);\n            #ifdef USE_PHONG\n                reflectLight += irradiance * BRDF_Specular_BlinnPhong(specularColor, N, L, V, u_Specular) * specularStrength;\n            #endif\n            totalReflect += reflectLight;\n        }\n    }\n    #endif\n    outColor.xyz = totalReflect.xyz;\n#endif",
light_pars_frag: "#ifdef USE_AMBIENT_LIGHT\n    #include <ambientlight_pars_frag>\n#endif\n#ifdef USE_DIRECT_LIGHT\n    #include <directlight_pars_frag>\n#endif\n#ifdef USE_POINT_LIGHT\n    #include <pointlight_pars_frag>\n#endif\n#ifdef USE_SPOT_LIGHT\n    #include <spotlight_pars_frag>\n#endif",
normalMap_pars_frag: "#include <tbn>\n#include <tsn>\nuniform sampler2D normalMap;",
normal_frag: "#ifdef USE_NORMAL\n    #ifdef DOUBLE_SIDED\n    \tfloat flipNormal = ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n    #else\n    \tfloat flipNormal = 1.0;\n    #endif\n    #ifdef FLAT_SHADED\n    \tvec3 fdx = vec3( dFdx( v_ViewModelPos.x ), dFdx( v_ViewModelPos.y ), dFdx( v_ViewModelPos.z ) );\n    \tvec3 fdy = vec3( dFdy( v_ViewModelPos.x ), dFdy( v_ViewModelPos.y ), dFdy( v_ViewModelPos.z ) );\n    \tvec3 N = normalize( cross( fdx, fdy ) );\n    #else\n        vec3 N = normalize(v_Normal) * flipNormal;\n    #endif\n    #ifdef USE_NORMAL_MAP\n        vec3 normalMapColor = texture2D(normalMap, v_Uv).rgb;\n        mat3 tspace = tsn(N, -v_ViewModelPos, vec2(v_Uv.x, 1.0 - v_Uv.y));\n        N = normalize(tspace * (normalMapColor * 2.0 - 1.0));\n    #elif defined(USE_BUMPMAP)\n        N = perturbNormalArb(-v_ViewModelPos, N, dHdxy_fwd(v_Uv));\n    #endif\n#endif",
normal_pars_frag: "#ifdef USE_NORMAL\n    varying vec3 v_Normal;\n#endif",
normal_pars_vert: "#ifdef USE_NORMAL\n    varying vec3 v_Normal;\n#endif",
normal_vert: "#ifdef USE_NORMAL\n    v_Normal = (transpose(inverse(u_View * u_Model)) * vec4(objectNormal, 1.0)).xyz;\n    #ifdef FLIP_SIDED\n    \tv_Normal = - v_Normal;\n    #endif\n#endif",
packing: "const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;\nconst vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );\nconst vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );\nconst float ShiftRight8 = 1. / 256.;\nvec4 packDepthToRGBA( const in float v ) {\n    vec4 r = vec4( fract( v * PackFactors ), v );\n    r.yzw -= r.xyz * ShiftRight8;    return r * PackUpscale;\n}\nfloat unpackRGBAToDepth( const in vec4 v ) {\n    return dot( v, UnpackFactors );\n}",
pointlight_pars_frag: "struct PointLight\n{\n    vec3 position;\n    vec4 color;\n    float intensity;\n    float distance;\n    float decay;\n    int shadow;\n    float shadowBias;\n    float shadowRadius;\n    vec2 shadowMapSize;\n};\nuniform PointLight u_Point[USE_POINT_LIGHT];",
premultipliedAlpha_frag: "#ifdef USE_PREMULTIPLIED_ALPHA\n    gl_FragColor.rgb = gl_FragColor.rgb * gl_FragColor.a;\n#endif",
pvm_vert: "gl_Position = u_Projection * u_View * u_Model * vec4(transformed, 1.0);",
shadowMap_frag: "#ifdef USE_SHADOW\n#endif",
shadowMap_pars_frag: "#ifdef USE_SHADOW\n    #include <packing>\n    #ifdef USE_DIRECT_LIGHT\n        uniform sampler2D directionalShadowMap[ USE_DIRECT_LIGHT ];\n        varying vec4 vDirectionalShadowCoord[ USE_DIRECT_LIGHT ];\n    #endif\n    #ifdef USE_POINT_LIGHT\n        uniform samplerCube pointShadowMap[ USE_POINT_LIGHT ];\n    #endif\n    #ifdef USE_SPOT_LIGHT\n        uniform sampler2D spotShadowMap[ USE_SPOT_LIGHT ];\n        varying vec4 vSpotShadowCoord[ USE_SPOT_LIGHT ];\n    #endif\n    float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {\n        return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );\n    }\n    float textureCubeCompare( samplerCube depths, vec3 uv, float compare ) {\n        return step( compare, unpackRGBAToDepth( textureCube( depths, uv ) ) );\n    }\n    float getShadow( sampler2D shadowMap, vec4 shadowCoord, float shadowBias, float shadowRadius, vec2 shadowMapSize ) {\n        shadowCoord.xyz /= shadowCoord.w;\n        float depth = shadowCoord.z + shadowBias;\n        bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\n        bool inFrustum = all( inFrustumVec );\n        bvec2 frustumTestVec = bvec2( inFrustum, depth <= 1.0 );\n        bool frustumTest = all( frustumTestVec );\n        if ( frustumTest ) {\n            #ifdef USE_PCF_SOFT_SHADOW\n                float texelSize = shadowRadius / shadowMapSize.x;\n                vec2 poissonDisk[4];\n                poissonDisk[0] = vec2(-0.94201624, -0.39906216);\n                poissonDisk[1] = vec2(0.94558609, -0.76890725);\n                poissonDisk[2] = vec2(-0.094184101, -0.92938870);\n                poissonDisk[3] = vec2(0.34495938, 0.29387760);\n                return texture2DCompare( shadowMap, shadowCoord.xy + poissonDisk[0] * texelSize, depth ) * 0.25 +\n                    texture2DCompare( shadowMap, shadowCoord.xy + poissonDisk[1] * texelSize, depth ) * 0.25 +\n                    texture2DCompare( shadowMap, shadowCoord.xy + poissonDisk[2] * texelSize, depth ) * 0.25 +\n                    texture2DCompare( shadowMap, shadowCoord.xy + poissonDisk[3] * texelSize, depth ) * 0.25;\n            #else\n                return texture2DCompare( shadowMap, shadowCoord.xy, depth );\n            #endif\n        }\n        return 1.0;\n    }\n    float getPointShadow( samplerCube shadowMap, vec3 V, float shadowBias, float shadowRadius, vec2 shadowMapSize ) {\n        float depth = (length(V) + shadowBias) / 1000.;\n        #ifdef USE_PCF_SOFT_SHADOW\n            float texelSize = shadowRadius / shadowMapSize.x;\n            vec3 poissonDisk[4];\n    \t\tpoissonDisk[0] = vec3(-1.0, 1.0, -1.0);\n    \t\tpoissonDisk[1] = vec3(1.0, -1.0, -1.0);\n    \t\tpoissonDisk[2] = vec3(-1.0, -1.0, -1.0);\n    \t\tpoissonDisk[3] = vec3(1.0, -1.0, 1.0);\n            return textureCubeCompare( shadowMap, normalize(V) + poissonDisk[0] * texelSize, depth ) * 0.25 +\n                textureCubeCompare( shadowMap, normalize(V) + poissonDisk[1] * texelSize, depth ) * 0.25 +\n                textureCubeCompare( shadowMap, normalize(V) + poissonDisk[2] * texelSize, depth ) * 0.25 +\n                textureCubeCompare( shadowMap, normalize(V) + poissonDisk[3] * texelSize, depth ) * 0.25;\n        #else\n            return textureCubeCompare( shadowMap, normalize(V), depth);\n        #endif\n    }\n#endif",
shadowMap_pars_vert: "#ifdef USE_SHADOW\n    #ifdef USE_DIRECT_LIGHT\n        uniform mat4 directionalShadowMatrix[ USE_DIRECT_LIGHT ];\n        varying vec4 vDirectionalShadowCoord[ USE_DIRECT_LIGHT ];\n    #endif\n    #ifdef USE_POINT_LIGHT\n    #endif\n    #ifdef USE_SPOT_LIGHT\n        uniform mat4 spotShadowMatrix[ USE_SPOT_LIGHT ];\n        varying vec4 vSpotShadowCoord[ USE_SPOT_LIGHT ];\n    #endif\n#endif",
shadowMap_vert: "#ifdef USE_SHADOW\n    vec4 worldPosition = u_Model * vec4(transformed, 1.0);\n    #ifdef USE_DIRECT_LIGHT\n        for ( int i = 0; i < USE_DIRECT_LIGHT; i ++ ) {\n            vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * worldPosition;\n        }\n    #endif\n    #ifdef USE_POINT_LIGHT\n    #endif\n    #ifdef USE_SPOT_LIGHT\n        for ( int i = 0; i < USE_SPOT_LIGHT; i ++ ) {\n            vSpotShadowCoord[ i ] = spotShadowMatrix[ i ] * worldPosition;\n        }\n    #endif\n#endif",
skinning_pars_vert: "#ifdef USE_SKINNING\n    attribute vec4 skinIndex;\n\tattribute vec4 skinWeight;\n    #ifdef BONE_TEXTURE\n        uniform sampler2D boneTexture;\n        uniform int boneTextureSize;\n        mat4 getBoneMatrix( const in float i ) {\n            float j = i * 4.0;\n            float x = mod( j, float( boneTextureSize ) );\n            float y = floor( j / float( boneTextureSize ) );\n            float dx = 1.0 / float( boneTextureSize );\n            float dy = 1.0 / float( boneTextureSize );\n            y = dy * ( y + 0.5 );\n            vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );\n            vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );\n            vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );\n            vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );\n            mat4 bone = mat4( v1, v2, v3, v4 );\n            return bone;\n        }\n    #else\n        uniform mat4 boneMatrices[MAX_BONES];\n        mat4 getBoneMatrix(const in float i) {\n            mat4 bone = boneMatrices[int(i)];\n            return bone;\n        }\n    #endif\n#endif",
skinning_vert: "#ifdef USE_SKINNING\n    mat4 boneMatX = getBoneMatrix( skinIndex.x );\n    mat4 boneMatY = getBoneMatrix( skinIndex.y );\n    mat4 boneMatZ = getBoneMatrix( skinIndex.z );\n    mat4 boneMatW = getBoneMatrix( skinIndex.w );\n    vec4 skinVertex = vec4(transformed, 1.0);\n    vec4 skinned = vec4( 0.0 );\n\tskinned += boneMatX * skinVertex * skinWeight.x;\n\tskinned += boneMatY * skinVertex * skinWeight.y;\n\tskinned += boneMatZ * skinVertex * skinWeight.z;\n\tskinned += boneMatW * skinVertex * skinWeight.w;\n    transformed = vec3(skinned.xyz / skinned.w);\n    #if defined(USE_NORMAL) || defined(USE_ENV_MAP)\n        mat4 skinMatrix = mat4( 0.0 );\n        skinMatrix += skinWeight.x * boneMatX;\n        skinMatrix += skinWeight.y * boneMatY;\n        skinMatrix += skinWeight.z * boneMatZ;\n        skinMatrix += skinWeight.w * boneMatW;\n        objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;\n    #endif\n#endif",
specularMap_frag: "float specularStrength;\n#ifdef USE_SPECULARMAP\n\tvec4 texelSpecular = texture2D( specularMap, v_Uv );\n\tspecularStrength = texelSpecular.r;\n#else\n\tspecularStrength = 1.0;\n#endif",
specularMap_pars_frag: "#ifdef USE_SPECULARMAP\n\tuniform sampler2D specularMap;\n#endif",
spotlight_pars_frag: "struct SpotLight\n{\n    vec3 position;\n    vec4 color;\n    float intensity;\n    float distance;\n    float decay;\n    float coneCos;\n    float penumbraCos;\n    vec3 direction;\n    int shadow;\n    float shadowBias;\n    float shadowRadius;\n    vec2 shadowMapSize;\n};\nuniform SpotLight u_Spot[USE_SPOT_LIGHT];",
tbn: "mat3 tbn(vec3 N, vec3 p, vec2 uv) {\n    vec3 dp1 = dFdx(p.xyz);\n    vec3 dp2 = dFdy(p.xyz);\n    vec2 duv1 = dFdx(uv.st);\n    vec2 duv2 = dFdy(uv.st);\n    vec3 dp2perp = cross(dp2, N);\n    vec3 dp1perp = cross(N, dp1);\n    vec3 T = dp2perp * duv1.x + dp1perp * duv2.x;\n    vec3 B = dp2perp * duv1.y + dp1perp * duv2.y;\n    float invmax = 1.0 / sqrt(max(dot(T,T), dot(B,B)));\n    return mat3(T * invmax, B * invmax, N);\n}",
transpose: "mat4 transpose(mat4 inMatrix) {\n    vec4 i0 = inMatrix[0];\n    vec4 i1 = inMatrix[1];\n    vec4 i2 = inMatrix[2];\n    vec4 i3 = inMatrix[3];\n    mat4 outMatrix = mat4(\n        vec4(i0.x, i1.x, i2.x, i3.x),\n        vec4(i0.y, i1.y, i2.y, i3.y),\n        vec4(i0.z, i1.z, i2.z, i3.z),\n        vec4(i0.w, i1.w, i2.w, i3.w)\n    );\n    return outMatrix;\n}",
tsn: "mat3 tsn(vec3 N, vec3 V, vec2 uv) {\n    vec3 q0 = dFdx( V.xyz );\n    vec3 q1 = dFdy( V.xyz );\n    vec2 st0 = dFdx( uv.st );\n    vec2 st1 = dFdy( uv.st );\n    vec3 S = normalize( q0 * st1.t - q1 * st0.t );\n    vec3 T = normalize( -q0 * st1.s + q1 * st0.s );\n    mat3 tsn = mat3( S, T, N );\n    return tsn;\n}",
uv_pars_frag: "#if defined(USE_DIFFUSE_MAP) || defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP) || defined(USE_SPECULARMAP) || defined(USE_EMISSIVEMAP)\n    varying vec2 v_Uv;\n#endif",
uv_pars_vert: "#if defined(USE_DIFFUSE_MAP) || defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP) || defined(USE_SPECULARMAP) || defined(USE_EMISSIVEMAP)\n    attribute vec2 a_Uv;\n    varying vec2 v_Uv;\n#endif",
uv_vert: "#if defined(USE_DIFFUSE_MAP) || defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP) || defined(USE_SPECULARMAP) || defined(USE_EMISSIVEMAP)\n    v_Uv = a_Uv;\n#endif",
viewModelPos_pars_frag: "#if defined(USE_POINT_LIGHT) || defined(USE_SPOT_LIGHT) || defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP) || defined(FLAT_SHADED) || ( defined(USE_PHONG) && defined(USE_DIRECT_LIGHT) )\n    varying vec3 v_ViewModelPos;\n#endif",
viewModelPos_pars_vert: "#if defined(USE_POINT_LIGHT) || defined(USE_SPOT_LIGHT) || defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP) || defined(FLAT_SHADED) || ( defined(USE_PHONG) && defined(USE_DIRECT_LIGHT) )\n    varying vec3 v_ViewModelPos;\n#endif",
viewModelPos_vert: "#if defined(USE_POINT_LIGHT) || defined(USE_SPOT_LIGHT) || defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP) || defined(FLAT_SHADED) || ( defined(USE_PHONG) && defined(USE_DIRECT_LIGHT) )\n    v_ViewModelPos = (u_View * u_Model * vec4(transformed, 1.0)).xyz;\n#endif",
}
})();