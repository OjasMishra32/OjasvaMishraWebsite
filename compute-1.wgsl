// Three.js r187 - Node System

// directives


// system
var<private> instanceIndex : u32;

// locals


// structs


// uniforms
@binding( 3 ) @group( 0 ) var nodeUniform8_sampler : sampler;
@binding( 4 ) @group( 0 ) var nodeUniform8 : texture_2d<f32>;
@binding( 6 ) @group( 0 ) var nodeUniform15_sampler : sampler;
@binding( 7 ) @group( 0 ) var nodeUniform15 : texture_2d<f32>;
@binding( 8 ) @group( 0 ) var nodeUniform16_sampler : sampler;
@binding( 9 ) @group( 0 ) var nodeUniform16 : texture_2d<f32>;

struct nodeUniform0Struct {
	value : array< vec3<f32> >
};
@binding( 0 ) @group( 0 )
var<storage, read_write> nodeUniform0 : nodeUniform0Struct;

struct nodeUniform3Struct {
	value : array< vec3<f32> >
};
@binding( 2 ) @group( 0 )
var<storage, read_write> nodeUniform3 : nodeUniform3Struct;

struct nodeUniform11Struct {
	value : array< f32 >
};
@binding( 5 ) @group( 0 )
var<storage, read_write> nodeUniform11 : nodeUniform11Struct;

struct objectStruct {
	nodeUniform1 : vec3<f32>,
	nodeUniform2 : f32,
	nodeUniform4 : vec3<f32>,
	nodeUniform5 : f32,
	nodeUniform6 : vec2<f32>,
	nodeUniform7 : f32,
	nodeUniform9 : f32,
	nodeUniform10 : f32,
	nodeUniform12 : f32,
	nodeUniform13 : vec4<f32>,
	nodeUniform14 : f32,
	nodeUniform17 : vec2<f32>,
	nodeUniform18 : f32,
	nodeUniform19 : f32,
	nodeUniform20 : f32,
	nodeUniform21 : f32,
	nodeUniform22 : f32,
	nodeUniform23 : vec2<f32>,
	nodeUniform24 : u32
};
@binding( 1 ) @group( 0 )
var<uniform> object : objectStruct;

// vars
var<private> nodeVar0 : f32;
var<private> nodeVar1 : vec4<f32>;
var<private> nodeVar2 : vec4<f32>;

// codes
fn tsl_mod_float( x : f32, y : f32 ) -> f32 { return x - y * floor( x / y ); }


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

	if ( instanceIndex >= object.nodeUniform24 ) { return; }

	let nodeConst0 = ( nodeUniform3.value[ instanceIndex ] - object.nodeUniform4 );
	nodeUniform0.value[ instanceIndex ] = ( nodeUniform0.value[ instanceIndex ] + ( ( ( ( vec3<f32>( object.nodeUniform1.x, 0.0, object.nodeUniform1.z ) * vec3<f32>( object.nodeUniform2 ) ) + ( normalize( vec3<f32>( nodeConst0.x, 0.0, nodeConst0.z ) ) * vec3<f32>( object.nodeUniform5 ) ) ) * vec3<f32>( length( object.nodeUniform1 ) ) ) * vec3<f32>( ( ( clamp( ( ( length( nodeConst0 ) - 0.5 ) / ( 2.0 - 0.5 ) ), 0.0, 1.0 ) * ( 0.0 - 1.0 ) ) + 1.0 ) ) ) );
	nodeVar0 = textureSampleLevel( nodeUniform8, nodeUniform8_sampler, ( ( nodeUniform3.value[ instanceIndex ].xz * vec2<f32>( object.nodeUniform9 ) ) + ( object.nodeUniform6 * vec2<f32>( object.nodeUniform10 ) ) ), 0 ).x;
	let nodeConst1 = max( ( ( ( object.nodeUniform7 - nodeVar0 ) * nodeUniform11.value[ instanceIndex ] ) * object.nodeUniform12 ), 0.0 );
	nodeUniform0.value[ instanceIndex ].x = ( nodeUniform0.value[ instanceIndex ].x + ( object.nodeUniform6.x * nodeConst1 ) );
	nodeUniform0.value[ instanceIndex ].z = ( nodeUniform0.value[ instanceIndex ].z + ( object.nodeUniform6.y * nodeConst1 ) );
	let nodeConst2 = ( nodeUniform3.value[ instanceIndex ].xz - object.nodeUniform13.xy );
	let nodeConst3 = ( object.nodeUniform13.z * 0.5 );
	let nodeConst4 = ( ( vec2<f32>( nodeConst2.x, nodeConst2.y ) * vec2<f32>( ( ( clamp( ( ( length( nodeConst2 ) - nodeConst3 ) / ( ( object.nodeUniform13.z * 1.0 ) - nodeConst3 ) ), 0.0, 1.0 ) * ( 0.0 - 0.2 ) ) + 0.2 ) ) ) * vec2<f32>( object.nodeUniform13.w ) );
	nodeUniform0.value[ instanceIndex ] = ( nodeUniform0.value[ instanceIndex ] + vec3<f32>( nodeConst4.x, 0.0, nodeConst4.y ) );
	nodeUniform0.value[ instanceIndex ].y = ( ( min( length( nodeUniform0.value[ instanceIndex ].xz ), 2.0 ) * object.nodeUniform14 ) * ( ( clamp( ( ( nodeUniform3.value[ instanceIndex ].y - 0.0 ) / ( 6.0 - 0.0 ) ), 0.0, 1.0 ) * ( 0.0 - 1.0 ) ) + 1.0 ) );
	nodeVar1 = textureSampleLevel( nodeUniform15, nodeUniform15_sampler, ( ( ( nodeUniform3.value[ instanceIndex ].xz / vec2<f32>( 128.0 ) ) / vec2<f32>( 1.5 ) ) + vec2<f32>( 0.5 ) ), 0 );
	nodeVar2 = textureSampleLevel( nodeUniform16, nodeUniform16_sampler, ( ( ( nodeUniform3.value[ instanceIndex ].xz - vec2<f32>( -20.0 ) ) - object.nodeUniform17 ) / vec2<f32>( 40.0 ) ), 0 );
	nodeVar1.y = ( nodeVar1.y * ( 1.0 - nodeVar2.x ) );
	nodeUniform0.value[ instanceIndex ] = ( nodeUniform0.value[ instanceIndex ] * vec3<f32>( ( 1.0 - ( max( ( ( clamp( ( ( nodeVar1.z - 0.4 ) / ( 0.0 - 0.4 ) ), 0.0, 1.0 ) * ( object.nodeUniform18 - object.nodeUniform19 ) ) + object.nodeUniform19 ), ( step( 0.05, nodeUniform3.value[ instanceIndex ].y ) * object.nodeUniform18 ) ) * object.nodeUniform20 ) ) ) );
	nodeUniform0.value[ instanceIndex ].y = ( nodeUniform0.value[ instanceIndex ].y - ( object.nodeUniform21 * nodeUniform11.value[ instanceIndex ] ) );
	nodeUniform3.value[ instanceIndex ] = ( nodeUniform3.value[ instanceIndex ] + ( nodeUniform0.value[ instanceIndex ] * vec3<f32>( object.nodeUniform20 ) ) );
	nodeUniform3.value[ instanceIndex ].y = max( nodeUniform3.value[ instanceIndex ].y, ( ( ( clamp( ( ( nodeVar1.z - 0.02 ) / ( 0.13 - 0.02 ) ), 0.0, 1.0 ) * ( object.nodeUniform22 - 0.0 ) ) + 0.0 ) + 0.02 ) );
	let nodeConst5 = ( 37.886130074279194 * 0.5 );
	nodeUniform3.value[ instanceIndex ].x = ( ( tsl_mod_float( ( ( nodeUniform3.value[ instanceIndex ].x + nodeConst5 ) - object.nodeUniform23.x ), 37.886130074279194 ) - nodeConst5 ) + object.nodeUniform23.x );
	nodeUniform3.value[ instanceIndex ].z = ( ( tsl_mod_float( ( ( nodeUniform3.value[ instanceIndex ].z + nodeConst5 ) - object.nodeUniform23.y ), 37.886130074279194 ) - nodeConst5 ) + object.nodeUniform23.y );

	

}
