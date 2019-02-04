import React,{Component} from 'react'
import {connect} from 'react-redux'
import {imagesHaveLoaded} from '../../ducks/reducer'
import Hibiscus from '../../assets/gltfs/hibiscus.glb'
import Door from '../../assets/gltfs/door.glb'
import Table from '../../assets/gltfs/table.glb'
import WallLight from '../../assets/gltfs/wallLight.glb'
import Frame from '../../assets/gltfs/frame.glb'
import Gymnopedie from '../../assets/audio/Gymnopedie_No_1.mp3'
import SnowDrop from '../../assets/audio/Snow_Drop.mp3'
import OnThePassingOfTime from '../../assets/audio/On_the_Passing_of_Time.mp3'
import ImpromputInQuarterCommaMeantone from '../../assets/audio/Impromptu_in_Quarter_Comma_Meantone.mp3'
import Granite from '../../assets/grey_granite_texture.jpg'
import Nymph from '../../assets/gltfs/smallestNymph.glb'
import Mars from '../../assets/gltfs/marsStatue.glb'
import Moon from '../../assets/gltfs/moon.glb'
import Carpet from '../../assets/gltfs/smallCarpet.glb'
import Emoji from '../../assets/gltfs/joyemoji.glb'
import Wood from '../../assets/laminate-floor.jpg'
import Marble from '../../assets/marble_texture.jpg'
import Stereo from '../../assets/gltfs/stereo.glb'
import MarblePlayer from '../../assets/gltfs/marblePlayer.glb'
import Penelope from '../../assets/gltfs/penelope.glb'
import Pedestal from '../../assets/gltfs/pedestal.glb'
import Bench from '../../assets/gltfs/bench.glb'
import 'aframe'
import {Entity} from 'aframe-react'

class Assets extends Component {
    constructor(props){
        super(props)
        this.state={
            images: []
        }
    }

componentWillMount(props){
let {images} = this.props
this.setState({images})
}

componentWillReceiveProps(nextProps) {
    if (this.props.images !== nextProps.images) {
      this.setState({images: nextProps.images}, () => {
          this.props.imagesHaveLoaded(true)
        })
    }
  }


render(){
    let {images} = this.state
    return(
    <a-assets>
        {/* User related Files from Store */}
        <img id="Portrait1" src={images[0]}  crossOrigin="anonymous" alt="user portrait #1"  className="Portrait" />
        <img id="Portrait2" src={images[1]}  crossOrigin="anonymous" alt="user portrait #2"  className="Portrait"/>
        <img id="Portrait3" src={images[2]}  crossOrigin="anonymous" alt="user portrait #3"  className="Portrait"/>
        <img id="Portrait4" src={images[3]}  crossOrigin="anonymous" alt="user portrait #4"  className="Portrait"/>
        <img id="Portrait5" src={images[4]}  crossOrigin="anonymous" alt="user portrait #5"  className="Portrait"/>
        <img id="Portrait6" src={images[5]}  crossOrigin="anonymous" alt="user portrait #6"  className="Portrait"/>
        <img id="Portrait7" src={images[6]}  crossOrigin="anonymous" alt="user portrait #7"  className="Portrait"/>
        <img id="Portrait8" src={images[7]}  crossOrigin="anonymous" alt="user portrait #8"  className="Portrait"/>
        <img id="Portrait9" src={images[8]}  crossOrigin="anonymous" alt="user portrait #9"  className="Portrait"/>
        <img id="Portrait10" src={images[9]}  crossOrigin="anonymous" alt="user portrait #10"  className="Portrait"/>
        <img id="Portrait11" src={images[10]}  crossOrigin="anonymous" alt="user portrait #11"  className="Portrait"/>
        <img id="Portrait12" src={images[11]}  crossOrigin="anonymous" alt="user portrait #12"  className="Portrait"/>
        <img id="Portrait13" src={images[12]}  crossOrigin="anonymous" alt="user portrait #13"  className="Portrait"/>
        <img id="Portrait14" src={images[13]}  crossOrigin="anonymous" alt="user portrait #14"  className="Portrait"/>
        <img id="Portrait15" src={images[14]} crossOrigin="anonymous" alt="user portrait #15"  className="Portrait"/>
  
        {/* Static Files from application */}
        {/* Textures */}
        <img id="wood" src={Wood} alt="wood floor texture" />
        <img id="marble" src={Marble} alt="marble floor texture" />
        <img id="granite" src={Granite} alt="marble floor texture" />
       
        {/* Objects */}
        <Entity id="frame" src={Frame} alt="Picture Frame" />
        <Entity id="nymph" src={Nymph} alt="Nymph Statue Obj" />
        <Entity id="marsStatue" src={Mars} alt="Mars Statue Obj" />
        <Entity id="moon" src={Moon} alt="Moon Obj" />
        <Entity id="carpet" src={Carpet} alt="Carpet Obj" />
        <Entity id="emoji" src={Emoji} alt="Emoji Entity" />
        <Entity id="wallLight" src={WallLight} alt="Wall Light Obj" />
        <Entity id="door" src={Door} alt="Door Obj" />
        <Entity id="table" src={Table} alt="Table Obj" />
        <Entity id="hibiscus" src={Hibiscus} alt="Plant Obj" />
        <Entity id="stereo" src={Stereo} alt="Stereo Obj" />
        <Entity id="marblePlayer" src={MarblePlayer} alt="Marble Player Obj" />
        <Entity id="pedestal" src={Pedestal} alt="pedestal Obj" />
        <Entity id="penelope" src={Penelope} alt="Marble Player Obj" />
        <Entity id="bench" src={Bench} alt="Bench Obj" />
        
        {/* Music */}
        <audio id="gymnopedie" src={Gymnopedie}/>
        <audio id="impromptu" src={ImpromputInQuarterCommaMeantone}/>
        <audio id="snowDrop" src={SnowDrop}/>
        <audio id="passingTime" src={OnThePassingOfTime}/>
    </a-assets>
    )
}
}

function mapStateToProps (state) {
    let {images, imagesHaveLoaded} = state
    return{
        images, imagesHaveLoaded
    }
}

export default connect(mapStateToProps, {imagesHaveLoaded})(Assets)