import React,{Component} from 'react'
import axios from 'axios'
import CreateGalleries from '../components//Lobby/createGalleries'
import GalleryBluePrint from '../components/Lobby/blueprint'
import Galleries from '../components/Lobby/galleries'
import Favorites from '../components/Lobby/favorites'
import Account from '../components/Lobby/account'
import Help from '../components/Lobby/help'
import '../Styles/Views/Lobby.css'
import Icon from '../Styles/Media/Icon.png'

class Lobby extends Component{
    constructor(){
        super()
            this.state ={
                user: '',
                usersGalleries: [],
                favoritedGalleries: [],
                theMagicWord: ''
            }
        this.changeWindow = this.changeWindow.bind(this)
    }

componentDidMount(){
//Validate User on Page as being logged in with session. If not, send back to landingPage; otherwise retrieve user's existing galleries and favorited galleries.
let user = this.props.match.params.username
axios.get(`/api/checkUser/`).then(res => {
    if (res.data !== user){
        this.props.history.push('/')
    } else {
        //Retrieve user's galleries and then favorited galleries while setting the first middle window to 'Create'
        axios.get('/api/retrieveGalleries/').then(res => {
            this.setState({usersGalleries: res.data, theMagicWord:'galleries'}, () => {
                axios.get('/api/getFavorites/').then(res => {
                    this.setState({favoritedGalleries: res.data})
                })
            })
        })
    }
})
}

changeNav = current => {
    document.querySelectorAll('[data-tab]').forEach(tab => {
        if (tab.innerText === current) {
            tab.classList.add('menu-back')
        }
        else {
            tab.classList.remove('menu-back')
        }
    })
    
}

changeWindow(magicWord){
const { theMagicWord } = this.state
console.log(magicWord)
if (magicWord === theMagicWord) return;
switch(magicWord){
    case "Create":
    this.setState({ theMagicWord: 'create' }, () => this.changeNav(magicWord))
    break;
    case "Galleries":
    this.setState({ theMagicWord: 'galleries' }, () => this.changeNav(magicWord))
    break;
    case "Favorites":
    this.setState({ theMagicWord: 'favorites' }, () => this.changeNav(magicWord))
    break;
    case 'Account':
    this.setState({ theMagicWord: 'account' }, () => this.changeNav(magicWord))
    break;
    case 'Help':
    this.setState({ theMagicWord: 'help' }, () => this.changeNav(magicWord))
    break;
}
}


logout(){
    // destroys sessions and redirects user to landing page.
    axios.post('/api/logout')
    .then(this.props.history.push('/'))
}

visitGallery(){
this.props.history.push('/gallery/')
}

editGallery(){

}

deleteGallery(){

}

render(){
    console.log(this.state.favoritedGalleries)
    const {favoritedGalleries, usersGalleries, theMagicWord} = this.state
    //Map over list of favorites and existing galleries, pass to separate components for styling them as distinct sections, 
    const listOfFavorites = favoritedGalleries.map((e, i) => {
        const image = e.thumbnail;
        const key = i;
        const views = e.views
        const favoriteNum = e.times_favorited
        const galleryName = e.gallery_name
        return(
            <>
            <Favorites
                key={key}
                image={image}
                views={views}
                favoriteNum={favoriteNum}
                galleryName={galleryName}
                visitGallery={this.visitGallery}
            />
            </>
        )
    })

    const galleryContainers = usersGalleries.map((e, i) => {
        const is_private_string = e.is_private.toString();
        const key = i;
        const image = e.thumbnail;
        const views = e.views;
        const favoriteNum = e.times_favorited
        return(
           <>
           <Galleries
            private={is_private_string}
            key={key}
            image={image}
            views={views}
            favoriteNum={favoriteNum}
            visitGallery={this.visitGallery}
            editGallery={this.editGallery}
           />
           </>
        )
    })
    return(
        <main id="Lobby">
            <section className="side-menu">
                <div id="menu-lobby">
                    <div className='menu-header center'>
                    <span>VR<span className='lighttext'>ART GALLERY</span></span>
                    <img src={Icon} className="icon" onClick={() => this.props.history.push('/')} />                    
                    </div>
                    <span data-tab className="menu-btn" onClick={() => this.changeWindow('Create')}>Create</span>
                    <span data-tab className="menu-btn" onClick={() => this.changeWindow('Galleries')}>Galleries</span>
                    <span data-tab className="menu-btn" onClick={() => this.changeWindow('Favorites')}>Favorites</span>
                    <span data-tab className="menu-btn" onClick={() => this.changeWindow('Account')}>Account</span>
                    <span data-tab className="menu-btn" onClick={() => this.changeWindow('Help')}>Help</span>
                    <span className="menu-btn" onClick={() => this.logout()}>Logout</span>
                </div>
            </section>
           
            <section className="middle-window">
                <div id="conditionally-rendered-lobby">
                {/* Conditionally rendering based on magicWord */}
                {
                    theMagicWord === 'create' ?
                    <div className="middle-window-container"> 
                        <CreateGalleries />
                    </div>
                    : theMagicWord === 'galleries' ? 
                    <div className="middle-window-container"> 
                        {galleryContainers}
                    </div>
                    : theMagicWord === 'favorites' ?
                    <div className="middle-window-container">
                        {listOfFavorites}
                    </div>
                    : theMagicWord === 'account' ?
                    <div className="middle-window-container">
                        <Account />
                    </div>
                    : theMagicWord === 'help' &&
                    <div className="middle-window-container">
                        <Help />
                    </div>
                }   
                </div>
            </section>
           
            {/* <section className="right-window">
                <div id="blueprint-lobby">
                    <GalleryBluePrint />
                </div>
            </section> */}
        </main>
    )
}
}

export default Lobby