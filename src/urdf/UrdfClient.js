/**
 * @author Jihoon Lee - jihoonlee.in@gmail.com
 * @author Russell Toris - rctoris@wpi.edu
 */

/**
 * A URDF client can be used to load a URDF and its associated models into a 3D object from the ROS
 * parameter server.
 *
 * Emits the following events:
 *
 * * 'change' - emited after the URDF and its meshes have been loaded into the root object
 *
 * @constructor
 * @param options - object with following keys:
 *
 *   * ros - the ROSLIB.Ros connection handle
 *   * param (optional) - the paramter to load the URDF from, like 'robot_description'
 *   * tfClient - the TF client handle to use
 *   * path (optional) - the base path to the associated Collada models that will be loaded
 *   * rootObject (optional) - the root object to add this marker to
 *   * tfPrefix (optional) - the TF prefix to used for multi-robots
 *   * loader (optional) - the Collada loader to use (e.g., an instance of ROS3D.COLLADA_LOADER
 *                         ROS3D.COLLADA_LOADER_2) -- defaults to ROS3D.COLLADA_LOADER_2
 */
ROS3D.UrdfClient = function(options) {
  var that = this;
  options = options || {};
  var ros = options.ros;
  var param = options.param || 'robot_description';
  var hidden = options.hidden || false;
  this.path = options.path || '/';
  this.tfClient = options.tfClient;
  this.color = options.color || null;
  this.rootObject = options.rootObject || new THREE.Object3D();
  var tfPrefix = options.tfPrefix || '';
  var loader = options.loader || ROS3D.COLLADA_LOADER_2;
  this.model = null;

  // get the URDF value from ROS
  var getParam = new ROSLIB.Param({
    ros : ros,
    name : param
  });
  getParam.get(function(string) {
    // hand off the XML string to the URDF model
    var urdfModel = new ROSLIB.UrdfModel({
      string : string
    });

    // load all models
    that.rootObject.add(new ROS3D.Urdf({
      urdfModel : urdfModel,
      path : that.path,
      tfClient : that.tfClient,
      tfPrefix : tfPrefix,
      loader : loader,
      color : that.color
    }));

    if(!hidden) {
	  that.rootObject.add(that.model);
    }
  });
};

ROS3D.UrdfClient.prototype.add = function(){
    this.rootObject.add(this.model);
};

ROS3D.UrdfClient.prototype.remove = function(){
    this.rootObject.remove(this.model);
};
