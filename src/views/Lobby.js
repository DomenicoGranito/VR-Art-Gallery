import React, { Component } from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import CreateGalleries from '../components/Lobby/createGalleries'
import Galleries from '../components/Lobby/galleries'
import Favorites from '../components/Lobby/favorites'
import Account from '../components/Lobby/account'
import Help from '../components/Lobby/help'
import '../styles/Views/Lobby.css'
import Icon from '../styles/Media/Icon.png'

class Lobby extends Component {
    constructor() {
        super()
        this.state = {
            user: '',
            usersGalleries: [],
            favoritedGalleries: [],
            theMagicWord: '',
            deleteConfirm: '',
            loading: true
        }
    }

    componentDidMount() {
        //Validate User on Page as being logged in with session. If not, send back to landingPage; otherwise retrieve user's existing galleries and favorited galleries.
        let user = this.props.match.params.username
        axios.get(`/api/checkUser/`).then(res => {
            if (res.data !== user) {
                this.props.history.push('/')
            } else {
                //Retrieve user's galleries and then favorited galleries while setting the first middle window to 'Create'

                axios.get('/api/retrieveGalleries/').then(res => {
                    this.setState({ usersGalleries: res.data,  user: this.props.match.params.username }, () => {
                        this.changeWindow('Galleries')
                        axios.get('/api/getFavorites/').then(res => {
                            this.setState({ favoritedGalleries: res.data, loading: false })
                        })
                    })
                })
            }
        })
    }

    componentWillUnmount() {
        const body = document.querySelector('html'),
            overlay = document.querySelector('.lobby-overlay')
        body.classList.remove('lobby-main-hide')
        overlay.removeEventListener('click', () => this.toggleMenu())
    }

    changeNav = current => {
        document.querySelectorAll('[data-tab]').forEach(tab => {
            const title = tab.innerText.split(' ')
            if (title[0] === current) tab.classList.add('menu-back')
            else tab.classList.remove('menu-back')
        })

    }

    changeWindow = magicWord => {
        const { theMagicWord } = this.state
        if (magicWord === theMagicWord) return;
        switch (magicWord) {
            case "Create":
                this.setState({ theMagicWord: 'create' }, () => {
                    const search = document.querySelector('.lobby-header_search')
                    search.style.visibility = 'hidden'
                    this.changeNav(magicWord)
                    this.toggleMenu()
                })
                break;
            case "Galleries":
                this.pageTop(magicWord)
                this.setState({ theMagicWord: 'galleries' }, () => {
                    const search = document.querySelector('.lobby-header_search')
                    search.style.visibility = 'visible'
                    this.changeNav(magicWord)
                    this.toggleMenu()
                })
                break;
            case "Favorites":
                this.pageTop(magicWord)
                this.setState({ theMagicWord: 'favorites' }, () => {
                    const search = document.querySelector('.lobby-header_search')
                    search.style.visibility = 'visible'
                    this.changeNav(magicWord)
                    this.toggleMenu()
                })
                break;
            case 'Account':
                this.setState({ theMagicWord: 'account' }, () => {
                    const search = document.querySelector('.lobby-header_search')
                    search.style.visibility = 'hidden'
                    this.changeNav(magicWord)
                    this.toggleMenu()
                })
                break;
            case 'Help':
                this.setState({ theMagicWord: 'help' }, () => {
                    const search = document.querySelector('.lobby-header_search')
                    search.style.visibility = 'hidden'
                    this.changeNav(magicWord)
                    this.toggleMenu()
                })
                break;
        }
    }


    logout() {
        // destroys sessions and redirects user to landing page.
        axios.post('/api/logout')
            .then(this.props.history.push('/'))
    }

    visitGallery = (galleryName, author) => {
        this.props.history.push(`/${author}/${galleryName}/`)
    }

    editGallery = id => {

    }

    deleteGallery = (id, galleryName) => {
        if (window.confirm('Are you sure you want to delete this gallery?')) {
            let galleries = [...this.state.usersGalleries];
            let index;
            for (let i = 0; i < galleries.length; i++) {
                if (galleries[i].id === id) {
                    index = i
                }
            }
            if (index !== -1) {
                galleries.splice(index, 1);
                this.setState({ usersGalleries: galleries })
            }
            axios.delete(`/api/deleteGallery/${id}`).then(res => {
                this.setState({ deleteConfirm: `${galleryName} was successfully deleted.` })
            })
        } else {
            this.setState({ deleteConfirm: `${galleryName} was not deleted.` })
        }
    }

    toggleMenu = command => {
        const menu = document.querySelector('.side-menu'),
            overlay = document.querySelector('.lobby-overlay'),
            body = document.querySelector('html')
        if (command === 'open') {
            menu.classList.add('menu-toggle')
            menu.classList.remove('menu-slide')
            overlay.style.visibility = 'visible'
            body.classList.add('lobby-main-hide')
            overlay.addEventListener('click', () => this.toggleMenu())
        }
        else {
            menu.classList.add('menu-slide')
            overlay.style.visibility = 'hidden'
            body.classList.remove('lobby-main-hide')
            overlay.removeEventListener('click', () => this.toggleMenu())
            setTimeout(() => {
                menu.classList.remove('menu-toggle')
            }, 500);
        }
    }

    pageTop = word => {
        if (word.toLowerCase() !== this.state.theMagicWord) window.scrollTo(0, 0)
    }

    checkUser = (loading, user) => {
        if (!loading && user !== this.props.match.params.username) this.props.history.push('/')
    }

    render() {
        const { favoritedGalleries, usersGalleries, theMagicWord, user, loading } = this.state
        this.checkUser(loading, user)
        //Map over list of favorites and existing galleries, pass to separate components for styling them as distinct sections, 
        const listOfFavorites = favoritedGalleries.map((e) => {
            const image = e.thumbnail,
                key = e.id,
                views = e.views,
                shares = e.shares,
                favoriteNum = e.times_favorited,
                galleryName = e.gallery_name,
                galleryAuthor = e.author;
            return (
                <Favorites
                    id={key}
                    image={image}
                    views={views}
                    shares={shares}
                    favoriteNum={favoriteNum}
                    galleryName={galleryName}
                    visitGallery={this.visitGallery}
                    author={galleryAuthor}
                />
            )
        })

        const galleryContainers = usersGalleries.map((e) => {
            const isPrivate = (e.is_private === 'true'),
                key = e.id,
                image = e.thumbnail,
                views = e.views,
                favoriteNum = e.times_favorited,
                author = e.author,
                galleryName = e.gallery_name
            return (
                <Galleries
                    galleryName={galleryName}
                    isPrivate={isPrivate}
                    id={key}
                    image={image}
                    views={views}
                    author={author}
                    favoriteNum={favoriteNum}
                    visitGallery={this.visitGallery}
                    editGallery={this.editGallery}
                    deleteGallery={this.deleteGallery}
                />
            )
        })
        return (
            <div className='lobby'>
                <div className='lobby-overlay' />
                <header className='lobby-header'>
                    <div className='lobby-header_left'>
                        <i className="fas fa-bars" onClick={() => this.toggleMenu('open')}></i>
                        <img src={Icon} onClick={() => this.props.history.push('/')} />
                        <span>VR<span className='lighttext'>ART GALLERY</span></span>
                    </div>
                    <div className='lobby-header_search'>
                        <input name='header' type='text' placeholder='Search' />
                        <div className='center'>
                            <i className="fas fa-search"></i>
                        </div>
                    </div>
                    <div className='lobby-header_right center'>
                        <span>{this.props.match.params.username}</span>
                    </div>
                </header>

                <section className="side-menu">
                    <div className="menu-column">
                        <div className='menu-header'>
                            <i className="fas fa-bars" onClick={() => this.toggleMenu()}></i>
                            <img src={Icon} onClick={() => this.props.history.push('/')} />
                            <span>VR<span className='lighttext'>ART GALLERY</span></span>
                        </div>
                        <span data-tab className="menu-btn menu-btn-first" onClick={() => this.props.history.push('/')}><i className="fas fa-home menu-icon"></i>Home</span>
                        <span data-tab className="menu-btn" onClick={() => this.changeWindow('Create')}><i className="fas fa-plus menu-icon"></i>Create</span>
                        <span data-tab className="menu-btn" onClick={() => this.changeWindow('Galleries')}><i className="fas fa-image menu-icon"></i>Galleries ({this.state.usersGalleries.length})</span>
                        <span data-tab className="menu-btn" onClick={() => this.changeWindow('Favorites')}><i className="fas fa-heart menu-icon"></i>Favorites ({this.state.favoritedGalleries.length})</span>
                        <span data-tab className="menu-btn" onClick={() => this.changeWindow('Account')}><i className="fas fa-user menu-icon"></i>Account</span>
                        <span data-tab className="menu-btn" onClick={() => this.changeWindow('Help')}><i className="fas fa-question menu-icon"></i>Help</span>
                        <span className="menu-btn" onClick={() => this.logout()}><i className="fas fa-arrow-alt-circle-left menu-icon"></i>Logout</span>
                    </div>
                </section>

                <main className='lobby-main'>
                    <div>
                        {/* Conditionally rendering based on magicWord */}
                        {
                            theMagicWord === 'create' ?
                                <div>
                                    <CreateGalleries
                                        user={this.props.match.params.username}
                                        galleries={usersGalleries}
                                    />
                                </div>
                                : theMagicWord === 'galleries' ?
                                    <div className='lobby-container_gallery'>
                                        <div className='lobby-card-grid'>
                                            {galleryContainers}
                                        </div>
                                    </div>
                                    : theMagicWord === 'favorites' ?
                                        <div className='lobby-container_gallery'>
                                            <div className='lobby-card-grid'>
                                                {listOfFavorites}
                                            </div>
                                        </div>
                                        : theMagicWord === 'account' ?
                                            <div>
                                                <Account />
                                            </div>
                                            : theMagicWord === 'help' &&
                                            <div>
                                                <Help />
                                            </div>
                        }
                    </div>
                </main>
            </div>
        )
    }
}

export default withRouter(Lobby)