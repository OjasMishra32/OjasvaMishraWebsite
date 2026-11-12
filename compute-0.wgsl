// Three.js r187 - Node System

// directives


// system
var<private> instanceIndex : u32;

// locals


// structs


// uniforms
@binding( 1 ) @group( 0 ) var nodeUniform1_sampler : sampler;
@binding( 2 ) @group( 0 ) var nodeUniform1 : texture_2d<f32>;

struct nodeUniform0Struct {
	value : array< vec3<f32> >
};
@binding( 0 ) @group( 0 )
var<storage, read_write> nodeUniform0 : nodeUniform0Struct;

struct objectStruct {
	nodeUniform2 : u32
};
@binding( 3 ) @group( 0 )
var<uniform> object : objectStruct;

// vars
var<private> nodeVar0 : f32;

// codes
fn fn5 ( seed : u32 ) -> f32 {

	

	let nodeConst0 = ( ( seed * 747796405u ) + 2891336453u );
	let nodeConst1 = ( ( ( nodeConst0 >> ( ( nodeConst0 >> 28u ) + 4u ) ) ^ nodeConst0 ) * 277803737u );

	return ( f32( ( ( nodeConst1 >> 22u ) ^ nodeConst1 ) ) * 2.3283064365386963e-10 );

}




@compute @workgroup_size( 64, 1, 1 )
fn main( @builtin( global_invocation_id ) globalId : vec3<u32>,
	@builtin( workgroup_id ) workgroupId : vec3<u32>,
	@builtin( local_invocation_id ) localId : vec3<u32>,
	@builtin( num_workgroups ) numWorkgroups : vec3<u32> ) {

	// local vars
	

	// system
	instanceIndex = globalId.x
		+ globalId.y * ( 64 * numWorkgroups.x )
		+ globalId.z * ( 64 * numWorkgroups.x ) * ( 1 * numWorkgroups.y );

	// flow
	// code

	if ( instanceIndex >= object.nodeUniform2 ) { return; }

	nodeUniform0.value[ instanceIndex ] = vec3<f32>( ( ( fn5( instanceIndex ) - 0.5 ) * 37.886130074279194 ), 0.0, ( ( fn5( ( instanceIndex + 1u ) ) - 0.5 ) * 37.886130074279194 ) );
	nodeVar0 = textureSampleLevel( nodeUniform1, nodeUniform1_sampler, ( nodeUniform0.value[ instanceIndex ].xz * vec2<f32>( 0.02 ) ), 0 ).x;
	nodeUniform0.value[ instanceIndex ].x = ( nodeUniform0.value[ instanceIndex ].x + ( nodeVar0 * 15.0 ) );

	

}
