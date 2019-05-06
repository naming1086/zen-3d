import alphaTest_frag from './shaderChunk/alphaTest_frag.glsl';
import ambientlight_pars_frag from './shaderChunk/ambientlight_pars_frag.glsl';
import aoMap_pars_frag from './shaderChunk/aoMap_pars_frag.glsl';
import begin_frag from './shaderChunk/begin_frag.glsl';
import begin_vert from './shaderChunk/begin_vert.glsl';
import bsdfs from './shaderChunk/bsdfs.glsl';
import bumpMap_pars_frag from './shaderChunk/bumpMap_pars_frag.glsl';
import clippingPlanes_frag from './shaderChunk/clippingPlanes_frag.glsl';
import clippingPlanes_pars_frag from './shaderChunk/clippingPlanes_pars_frag.glsl';
import color_frag from './shaderChunk/color_frag.glsl';
import color_pars_frag from './shaderChunk/color_pars_frag.glsl';
import color_pars_vert from './shaderChunk/color_pars_vert.glsl';
import color_vert from './shaderChunk/color_vert.glsl';
import common_frag from './shaderChunk/common_frag.glsl';
import common_vert from './shaderChunk/common_vert.glsl';
import diffuseMap_frag from './shaderChunk/diffuseMap_frag.glsl';
import diffuseMap_pars_frag from './shaderChunk/diffuseMap_pars_frag.glsl';
import directlight_pars_frag from './shaderChunk/directlight_pars_frag.glsl';
import emissiveMap_frag from './shaderChunk/emissiveMap_frag.glsl';
import emissiveMap_pars_frag from './shaderChunk/emissiveMap_pars_frag.glsl';
import encodings_frag from './shaderChunk/encodings_frag.glsl';
import encodings_pars_frag from './shaderChunk/encodings_pars_frag.glsl';
import end_frag from './shaderChunk/end_frag.glsl';
import envMap_frag from './shaderChunk/envMap_frag.glsl';
import envMap_pars_frag from './shaderChunk/envMap_pars_frag.glsl';
import envMap_pars_vert from './shaderChunk/envMap_pars_vert.glsl';
import envMap_vert from './shaderChunk/envMap_vert.glsl';
import fog_frag from './shaderChunk/fog_frag.glsl';
import fog_pars_frag from './shaderChunk/fog_pars_frag.glsl';
import inverse from './shaderChunk/inverse.glsl';
import light_frag from './shaderChunk/light_frag.glsl';
import light_pars_frag from './shaderChunk/light_pars_frag.glsl';
import normalMap_pars_frag from './shaderChunk/normalMap_pars_frag.glsl';
import normal_frag from './shaderChunk/normal_frag.glsl';
import normal_pars_frag from './shaderChunk/normal_pars_frag.glsl';
import normal_pars_vert from './shaderChunk/normal_pars_vert.glsl';
import normal_vert from './shaderChunk/normal_vert.glsl';
import packing from './shaderChunk/packing.glsl';
import pointlight_pars_frag from './shaderChunk/pointlight_pars_frag.glsl';
import premultipliedAlpha_frag from './shaderChunk/premultipliedAlpha_frag.glsl';
import pvm_vert from './shaderChunk/pvm_vert.glsl';
import shadow from './shaderChunk/shadow.glsl';
import shadowMap_frag from './shaderChunk/shadowMap_frag.glsl';
import shadowMap_pars_frag from './shaderChunk/shadowMap_pars_frag.glsl';
import shadowMap_pars_vert from './shaderChunk/shadowMap_pars_vert.glsl';
import shadowMap_vert from './shaderChunk/shadowMap_vert.glsl';
import morphnormal_vert from './shaderChunk/morphnormal_vert.glsl';
import morphtarget_pars_vert from './shaderChunk/morphtarget_pars_vert.glsl';
import morphtarget_vert from './shaderChunk/morphtarget_vert.glsl';
import skinning_pars_vert from './shaderChunk/skinning_pars_vert.glsl';
import skinning_vert from './shaderChunk/skinning_vert.glsl';
import specularMap_frag from './shaderChunk/specularMap_frag.glsl';
import specularMap_pars_frag from './shaderChunk/specularMap_pars_frag.glsl';
import spotlight_pars_frag from './shaderChunk/spotlight_pars_frag.glsl';
import tbn from './shaderChunk/tbn.glsl';
import transpose from './shaderChunk/transpose.glsl';
import tsn from './shaderChunk/tsn.glsl';
import uv_pars_frag from './shaderChunk/uv_pars_frag.glsl';
import uv_pars_vert from './shaderChunk/uv_pars_vert.glsl';
import uv_vert from './shaderChunk/uv_vert.glsl';
import viewModelPos_pars_frag from './shaderChunk/viewModelPos_pars_frag.glsl';
import viewModelPos_pars_vert from './shaderChunk/viewModelPos_pars_vert.glsl';
import viewModelPos_vert from './shaderChunk/viewModelPos_vert.glsl';

export var ShaderChunk = {
	alphaTest_frag: alphaTest_frag,
	ambientlight_pars_frag: ambientlight_pars_frag,
	aoMap_pars_frag: aoMap_pars_frag,
	begin_frag: begin_frag,
	begin_vert: begin_vert,
	bsdfs: bsdfs,
	bumpMap_pars_frag: bumpMap_pars_frag,
	clippingPlanes_frag: clippingPlanes_frag,
	clippingPlanes_pars_frag: clippingPlanes_pars_frag,
	color_frag: color_frag,
	color_pars_frag: color_pars_frag,
	color_pars_vert: color_pars_vert,
	color_vert: color_vert,
	common_frag: common_frag,
	common_vert: common_vert,
	diffuseMap_frag: diffuseMap_frag,
	diffuseMap_pars_frag: diffuseMap_pars_frag,
	directlight_pars_frag: directlight_pars_frag,
	emissiveMap_frag: emissiveMap_frag,
	emissiveMap_pars_frag: emissiveMap_pars_frag,
	encodings_frag: encodings_frag,
	encodings_pars_frag: encodings_pars_frag,
	end_frag: end_frag,
	envMap_frag: envMap_frag,
	envMap_pars_frag: envMap_pars_frag,
	envMap_pars_vert: envMap_pars_vert,
	envMap_vert: envMap_vert,
	fog_frag: fog_frag,
	fog_pars_frag: fog_pars_frag,
	inverse: inverse,
	light_frag: light_frag,
	light_pars_frag: light_pars_frag,
	normalMap_pars_frag: normalMap_pars_frag,
	normal_frag: normal_frag,
	normal_pars_frag: normal_pars_frag,
	normal_pars_vert: normal_pars_vert,
	normal_vert: normal_vert,
	packing: packing,
	pointlight_pars_frag: pointlight_pars_frag,
	premultipliedAlpha_frag: premultipliedAlpha_frag,
	pvm_vert: pvm_vert,
	shadow: shadow,
	shadowMap_frag: shadowMap_frag,
	shadowMap_pars_frag: shadowMap_pars_frag,
	shadowMap_pars_vert: shadowMap_pars_vert,
	shadowMap_vert: shadowMap_vert,
	morphnormal_vert: morphnormal_vert,
	morphtarget_pars_vert: morphtarget_pars_vert,
	morphtarget_vert: morphtarget_vert,
	skinning_pars_vert: skinning_pars_vert,
	skinning_vert: skinning_vert,
	specularMap_frag: specularMap_frag,
	specularMap_pars_frag: specularMap_pars_frag,
	spotlight_pars_frag: spotlight_pars_frag,
	tbn: tbn,
	transpose: transpose,
	tsn: tsn,
	uv_pars_frag: uv_pars_frag,
	uv_pars_vert: uv_pars_vert,
	uv_vert: uv_vert,
	viewModelPos_pars_frag: viewModelPos_pars_frag,
	viewModelPos_pars_vert: viewModelPos_pars_vert,
	viewModelPos_vert: viewModelPos_vert,
}
