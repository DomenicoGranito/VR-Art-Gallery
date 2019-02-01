import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Placeholder from '../../styles/Media/Placeholder.png'
import '../../styles/Components/createGalleries.css'
import Dropzone from 'react-dropzone'
import { v4 as randomStringGenerator } from 'uuid';
import axios from 'axios';
import UploadGalleryImages from './CreateSubComponents/uploadImages'
import GalleryPresets from './CreateSubComponents/galleryPresets'


class CreateGalleries extends Component {
    constructor(props) {
        super(props)
        this.state = {
            galleryName: '',
            author: '',
            isPrivate: false,
            imageAddress: '',
            thumbnail: '',
            numOfGalleries: 0,
            maxLimit: false,
            images: [],
            finalImages: [],
            captions: [],
            finalCaptions: [],
            isUploading: false,
            galleryPresets: [],
            finalGalleryPresets: [],
            editMode: false,
            galleryId: 0,
            finalCountdown: 1
        }
        this.retrievingImageData = this.retrievingImageData.bind(this)
        this.retrievingGalleryPresets = this.retrievingGalleryPresets.bind(this)
    }

    componentDidMount() {
        let { user, galleries, editGalleryId } = this.props
        const numOfGalleries = galleries.length
        if (editGalleryId) {
            this.setState({ author: user, numOfGalleries, editMode: true, galleryId: editGalleryId }, () => {
                this.editGallery(editGalleryId)
            })
        } else {
            // if user has reached limit 12, conditionally disallow the rendering of the create Gallery
            this.setState({ author: user, numOfGalleries }, () => {
                if (this.state.numOfGalleries === 12) {
                    this.setState({ maxLimit: true })
                }
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        if (nextProps.editGalleryId === 0) {
            this.setState({ images: [], captions: [], galleryName: '', imageAddress: '', thumbnail: '' })
        }
    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    setPrivacy = par => {
        if (par === 'private') {
            this.setState({ isPrivate: true })
        } else {
            this.setState({ isPrivate: false })
        }
    }

    getSignedRequestThumbnails = ([file]) => {
        console.log(this.state.url)
        console.log(file)
        this.setState({ isUploading: true });
        const fileName = `${randomStringGenerator()}-${file.name.replace(/\s/g, '-')}`;
        axios
            .get('/api/amazons3/thumbnails/', {
                params: { 'file-name': fileName, 'file-type': file.type },
            })
            .then(res => {
                const { signedRequest, url } = res.data;
                console.log(url)
                this.uploadFile(file, signedRequest, url);
            })
            .catch(err => {
                console.log(err);
            });
    }
    uploadFile = (file, signedRequest, url) => {
        console.log(url)
        const options = {
            headers: {
                'Content-Type': file.type,
            },
        };

        axios
            .put(signedRequest, file, options)
            .then(res => {
                console.log(url)
                this.setState({ isUploading: false, imageAddress: url })
                // .then(console.log("this is the url",url))
                // THEN DO SOMETHING WITH THE URL. SEND TO DB 
            })

            .catch(err => {
                this.setState({
                    isUploading: false,
                });
                if (err.response.status === 403) {
                    alert(
                        `Your request for a signed URL failed with a status 403. Double check the CORS configuration and bucket policy in the README. You also will want to double check your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env and ensure that they are the same as the ones that you created in the IAM dashboard. You may need to generate new keys\n${
                        err.stack
                        }`
                    );
                } else {
                    alert(`ERROR: ${err.status}\n ${err.stack}`);
                }
            });
    };


    onCancel = () => {
        this.setState({
            files: []
        });
    }


    createNewGallery = () => {
        // If galleryName, author, or thumbnail are left blank, user should be notified to fill in the missing blanks.
        const { galleryName, author, thumbnail, isPrivate } = this.state
        if (!galleryName || !author || !thumbnail) return;

        // this state object value is being passed down to galleryPresets and uploadImage components which are waiting for the value to turn to 0 before sending the final selections for presets, images, and captions back to this component to be shipped to database. Relevant functions: retrievingImageData, retrievingGalleryPresets, and finalizeGallery - all listed below.
        this.setState({ finalCountdown: 0 })
    }

    retrievingImageData = (image, caption) => {
        // Taking ImageURLs and ImageCaptions from each uploadImage component, pushing them into a copy of finalImages and finalCaptions arrays to be sent to the database
        console.log(image, caption)
        let images = this.state.finalImages
        let captions = this.state.finalCaptions
        images.push(image)
        captions.push(caption)
        this.setState({ finalImages: images, finalCaptions: captions, finalCountdown: 1 })
    }

    retrievingGalleryPresets = (state) => {
        let { music, lighting, floorTexture, ceilingTexture, wallTexture } = state
        let finalGalleryPresets = [music, lighting, floorTexture, ceilingTexture, wallTexture];
        this.setState({ finalGalleryPresets }, () => {
            this.finalizeGallery()
        })
    }

    finalizeGallery() {
        let { finalImages, finalCaptions, finalGalleryPresets, galleryName, author, imageAddress, thumbnail, isPrivate, galleryId } = this.state
        // Passes all relevant info to backend where separate queries will be made to populate galleries, gallery_preset, images, and captions tables if this a a new gallery. If createGallery is in editMode, it will update existing gallery.
        if (!this.state.editMode) {
            axios.post(`/api/createNewGallery/`, { galleryName, author, thumbnail: imageAddress || thumbnail, isPrivate, finalImages, finalCaptions, finalGalleryPresets }).then(res => {
                console.log('Finished for creation?')
            })
        } else if (this.state.editMode) {
            axios.put(`/api/updateGallery/${galleryId}`, { galleryName, author, thumbnail: imageAddress || thumbnail, isPrivate, finalImages, finalCaptions, finalGalleryPresets }).then(res => {
                console.log('Finished?')
            })
        }
    }

    editGallery = id => {
        // set State with gallery related info after retrieving gallery info.
        axios.get(`/api/editGallery/${id}`).then(res => {
            let { image1, image2, image3, image4, image5, image6, image7, image8, image9, image10, image11, image12, image13, image14, image15, gallery_name, atmosphere_lighting, music, wall_texture, is_private, thumbnail, ceiling_texture, floor_texture, img1_caption, img2_caption, img3_caption, img4_caption, img5_caption, img6_caption, img7_caption, img8_caption, img9_caption, img10_caption, img11_caption, img12_caption, img13_caption, img14_caption, img15_caption } = res.data[0]
            let images = [image1, image2, image3, image4, image5, image6, image7, image8, image9, image10, image11, image12, image13, image14, image15]
            let captions = [img1_caption, img2_caption, img3_caption, img4_caption, img5_caption, img6_caption, img7_caption, img8_caption, img9_caption, img10_caption, img11_caption, img12_caption, img13_caption, img14_caption, img15_caption]
            let galleryPresets = [ceiling_texture, wall_texture, atmosphere_lighting, floor_texture, music]
            this.setState({ galleryName: gallery_name, isPrivate: is_private, thumbnail, images, captions, galleryPresets })
        })
    }

    handlePrivacy = bool => {
        this.setState({ isPrivate: bool })
    }


    render(props) {
        let { author, galleryName, thumbnail, isPrivate, numOfGalleries, maxLimit, isUploading, editMode, galleryId, imageAddress } = this.state
        // If there are multiple galleries, the spelling should reflect that correctly.
        let spellingGallery = numOfGalleries === 1 ? 'gallery' : 'galleries'
        return (
            <section className="create-galleries">
                {maxLimit ?
                    <div className='create-galleries_max center'>
                        You currently have reached the gallery amount cap.
                        You can either edit an existing gallery or delete one to continue.
                        </div>
                    :
                    <>
                        <div className='create-gallery-header center'>CARD</div>
                        <div className="create-gallery_card">
                            <div className='create-gallery_cardleft'>
                                <h3>Gallery Info</h3>
                                <h1>Gallery Name</h1>
                                <input name="galleryName" onChange={(e) => this.handleChange(e)} maxLength='100' />
                                <h2>Privacy</h2>
                                <div className='create-gallery-privacy'>
                                    <div style={this.state.isPrivate ? { opacity: '.5' } : { opacity: '1' }} onClick={() => this.handlePrivacy(false)}>Public <i className="fas fa-unlock" style={{ marginLeft: '10px', fontSize: '12px', marginTop: '5px' }}></i></div>
                                    <div style={this.state.isPrivate ? { opacity: '1' } : { opacity: '.5' }} onClick={() => this.handlePrivacy(true)}>Private <i className="fas fa-lock" style={{ marginLeft: '10px', fontSize: '12px', marginTop: '5px' }}></i></div>
                                </div>
                                <h1 style={{ marginTop: '10px' }}>Thumbnail URL</h1>
                                <input name="imageAddress" onChange={(e) => this.handleChange(e)} />
                                <h1 style={{ margin: '5px 0px' }}>or</h1>
                                <Dropzone
                                    onDropAccepted={this.getSignedRequestThumbnails.bind(this)}
                                    onFileDialogCancel={this.onCancel.bind(this)}
                                    accept="image/*"
                                    multiple={false}
                                >
                                    {({ getRootProps, getInputProps }) => (
                                        <div {...getRootProps()} style={{
                                            width: '100px',
                                            height: '40px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            background: 'rgb(119, 148, 253)',
                                            marginTop: '15px',
                                            fontSize: '15px',
                                            color: 'white',
                                            cursor: 'pointer'
                                        }}>
                                            <input {...getInputProps()} />
                                            <p>UPLOAD</p>
                                        </div>
                                    )}
                                </Dropzone>
                            </div>

                            <div className='create-gallery_cardright center'>
                                <h3>Preview</h3>
                                <div className='gallery-container' style={{ marginBottom: '0px' }}>
                                    <img src={imageAddress || thumbnail || Placeholder} alt='Card Thumbnail' className='gallery-thumbnail' onError={(e) => e.target.src = Placeholder} />
                                    <div className='gallery-text'>
                                        <h1 className='gallery-title'>{galleryName.split(' ')[0] ? galleryName.length > 15 ? galleryName.slice(0, 15) + '...' : galleryName : 'Sample Text'}</h1>
                                        <div className='gallery-title-hover'>{galleryName.split(' ')[0] ? galleryName : 'Sample Text'}</div>
                                        <h3 className='gallery-author'>BY: {author}</h3>
                                        <div className='gallery-stats'>
                                            {isPrivate ? <><i className="fas fa-lock stat"></i> <span>Private</span></> : <><i className="fas fa-unlock stat"></i> <span>Public</span> </>}
                                            <i className="fas fa-eye stat"></i><span>0</span>
                                            <i className="fas fa-heart stat"></i><span>0</span>
                                            <i className="fas fa-share stat"></i><span>0</span>
                                            <div className='gallery-pop'>
                                                <div className='center'>EDIT</div>
                                                <div className='center'>DELETE</div>
                                            </div>
                                        </div>
                                        <div className='gallery-view center'>Visit Gallery</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='create-gallery-header center'>IMAGES</div>

                        <UploadGalleryImages
                            existingImages={this.state.images}
                            existingCaptions={this.state.captions}
                            retrievingImageData={this.retrievingImageData}
                            finalCountdown={this.state.finalCountdown}
                        />

                        <div className='create-gallery-header center'>GALLERY</div>

                        <GalleryPresets
                            galleryPresets={this.state.galleryPresets}
                            retrievingGalleryPresets={this.retrievingGalleryPresets}
                            finalCountdown={this.state.finalCountdown}
                        />

                        {
                            editMode ?
                                <span id="edit-gallery-btn" className='center' onClick={this.createNewGallery}>Save Changes</span>
                                :
                                <span id="create-gallery-btn" className='center' onClick={this.createNewGallery}>Create Gallery</span>
                        }
                    </>
                }
            </section>
        )
    }
}

export default CreateGalleries