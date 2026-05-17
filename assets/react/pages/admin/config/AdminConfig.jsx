import { useState, useEffect } from 'react';
import useConfigStore from '../../../stores/configStore';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Box, Modal, TextField } from '@mui/material';
import FileForm from '../../../components/file_form/FileForm';
import { getModalStyle } from '../../../services/data';
import { deletePhoto } from '../../../stores/fileStore';
import { useForm } from 'react-hook-form';

const AdminConfig = () => {
  const { config, getConfig, updateConfig } = useConfigStore();
  const [formType, setFormType] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    getConfig();
  }, []);

  const editNeedLogin = async (need) => {
    await updateConfig({ needLogin: need });
  };

  const editBannerPhoto = async (formType = null) => {
    if (formType === null) {
      const oldPhotoId = config.bannerPhoto?.id ?? null;
      await updateConfig({ bannerPhoto: null });
      await deletePhoto(oldPhotoId);
    } else {
      setFormType(formType);
    }
  };

  const sendBannerPhoto = async (data) => {
    if (data['@id']) {
      const oldPhotoId = config.bannerPhoto?.id ?? null;
      await updateConfig({ bannerPhoto: data['@id'] });
      await deletePhoto(oldPhotoId);
    }
  };

  const toggleForm = (type = null) => {
    if (type === 2) {
      reset({
        news1Title: config.news1Title,
        news1Content: config.news1Content,
      });
    }
    if (type === 4) {
      reset({
        news2Title: config.news2Title,
        news2Content: config.news2Content,
      });
    }
    if (type === 6) {
      reset({
        news3Title: config.news3Title,
        news3Content: config.news3Content,
      });
    }
    setFormType(type);
  };

  const handleNews = async (data) => {
    await updateConfig(data);
  };

  const handleNewsPhoto = async (data) => {
    if (data['@id']) {
      const oldPhotoId =
        formType === 3 ? config.news1Photo?.id : formType === 5 ? config.news2Photo?.id : config.news3Photo?.id;
      if (formType === 3) await updateConfig({ news1Photo: data['@id'] });
      if (formType === 5) await updateConfig({ news2Photo: data['@id'] });
      if (formType === 7) await updateConfig({ news3Photo: data['@id'] });
      await deletePhoto(oldPhotoId);
    }
  };

  const editLoginGuidePhoto = async (data) => {
    let canDelete = data === null ? true : false;
    const oldPhotoId = config.loginGuidePhoto?.id;

    if (data === null) {
      await updateConfig({ loginGuidePhoto: null });
    } else if (data && data['@id']) {
      canDelete = true;
      await updateConfig({ loginGuidePhoto: data['@id'] });
    }

    if (canDelete) await deletePhoto(oldPhotoId);
  };

  return (
    <>
      <section id="admin-config" className="video">
        <div className="container-fluid pt-3">
          <div className="row">
            <div className="col-12 mb-3">
              <h3 className="d-flex align-items-center">Configuration</h3>
            </div>
          </div>
          {config !== null && (
            <>
              <div className="row">
                <div className="col-12 col-md-6 col-lg-3 text-center mb-4">
                  <Card sx={{ width: '100%', margin: 'auto' }}>
                    <CardActionArea>
                      <CardContent>
                        <Typography variant="h5" component="div" className="mb-3">
                          Le login is nécessaire?
                        </Typography>
                        <Typography variant="body2">{config?.needLogin === true ? 'Oui' : 'Non'}</Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions className="d-flex justify-content-between">
                      <Button size="small" color="primary" onClick={() => editNeedLogin(true)}>
                        Oui
                      </Button>
                      <Button size="small" color="error" onClick={() => editNeedLogin(false)}>
                        Non
                      </Button>
                    </CardActions>
                  </Card>
                </div>
                <div className="col-12 col-md-6 col-lg-3 text-center mb-4">
                  <Card sx={{ width: '100%', margin: 'auto' }}>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        height="140"
                        image={
                          config.bannerPhoto
                            ? `${process.env.AWS_FILE_PREFIX}${config.bannerPhoto.imageName}`
                            : '/build/static/poster_not_found.png'
                        }
                        alt=""
                      />
                      <CardContent>
                        <Typography variant="h5" component="div" className="mb-3">
                          Bannière
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions className="d-flex justify-content-between">
                      <Button size="small" color="primary" onClick={() => editBannerPhoto(1)}>
                        Modifer
                      </Button>
                      <Button size="small" color="error" onClick={() => editBannerPhoto()}>
                        Supprimer
                      </Button>
                    </CardActions>
                  </Card>
                </div>
                <div className="col-12 col-md-6 col-lg-3 text-center mb-4">
                  <Card sx={{ width: '100%', margin: 'auto' }}>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        height="140"
                        image={
                          config.loginGuidePhoto
                            ? `${process.env.AWS_FILE_PREFIX}${config.loginGuidePhoto.imageName}`
                            : '/build/static/poster_not_found.png'
                        }
                        alt=""
                      />
                      <CardContent>
                        <Typography variant="h5" component="div" className="mb-3">
                          Guide de connexion
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions className="d-flex justify-content-between">
                      <Button size="small" color="primary" onClick={() => setFormType(8)}>
                        Modifer
                      </Button>
                      <Button size="small" color="error" onClick={() => editLoginGuidePhoto(null)}>
                        Supprimer
                      </Button>
                    </CardActions>
                  </Card>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md-4 text-center mb-4">
                  <Card sx={{ width: '100%', margin: 'auto' }}>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        image={
                          config.news1Photo
                            ? `${process.env.AWS_FILE_PREFIX}${config.news1Photo.imageName}`
                            : '/build/static/poster_not_found.png'
                        }
                        alt=""
                      />
                      <CardContent>
                        <Typography component="div" className="mb-3">
                          Dernières actualités 1
                        </Typography>
                        <Typography variant="h5" component="div" className="mb-3">
                          {config.news1Title}
                        </Typography>
                        <Typography component="div" className="mb-3">
                          {config.news1Content}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions className="d-flex justify-content-between">
                      <Button size="small" color="primary" onClick={() => toggleForm(2)}>
                        Modifer
                      </Button>
                      <Button size="small" color="info" onClick={() => toggleForm(3)}>
                        Photo
                      </Button>
                    </CardActions>
                  </Card>
                </div>
                <div className="col-12 col-md-4 text-center mb-4">
                  <Card sx={{ width: '100%', margin: 'auto' }}>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        image={
                          config.news2Photo
                            ? `${process.env.AWS_FILE_PREFIX}${config.news2Photo.imageName}`
                            : '/build/static/poster_not_found.png'
                        }
                        alt=""
                      />
                      <CardContent>
                        <Typography component="div" className="mb-3">
                          Dernières actualités 2
                        </Typography>
                        <Typography variant="h5" component="div" className="mb-3">
                          {config.news2Title}
                        </Typography>
                        <Typography component="div" className="mb-3">
                          {config.news2Content}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions className="d-flex justify-content-between">
                      <Button size="small" color="primary" onClick={() => toggleForm(4)}>
                        Modifer
                      </Button>
                      <Button size="small" color="info" onClick={() => toggleForm(5)}>
                        Photo
                      </Button>
                    </CardActions>
                  </Card>
                </div>
                <div className="col-12 col-md-4 text-center mb-4">
                  <Card sx={{ width: '100%', margin: 'auto' }}>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        image={
                          config.news3Photo
                            ? `${process.env.AWS_FILE_PREFIX}${config.news3Photo.imageName}`
                            : '/build/static/poster_not_found.png'
                        }
                        alt=""
                      />
                      <CardContent>
                        <Typography component="div" className="mb-3">
                          Dernières actualités 3
                        </Typography>
                        <Typography variant="h5" component="div" className="mb-3">
                          {config.news3Title}
                        </Typography>
                        <Typography component="div" className="mb-3">
                          {config.news3Content}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions className="d-flex justify-content-between">
                      <Button size="small" color="primary" onClick={() => toggleForm(6)}>
                        Modifer
                      </Button>
                      <Button size="small" color="info" onClick={() => toggleForm(7)}>
                        Photo
                      </Button>
                    </CardActions>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <Modal
        open={formType === null ? false : true}
        onClose={() => setFormType(null)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={getModalStyle(500)} onClick={(e) => e.stopPropagation()}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 4 }}>
            {formType === 1 && `Editer la bannière`}
            {formType === 2 && `Editer l'actualité 1`}
            {formType === 3 && `Editer l'image de l'actualité 1`}
            {formType === 4 && `Editer l'actualité 2`}
            {formType === 5 && `Editer l'image de l'actualité 2`}
            {formType === 6 && `Editer l'actualité 3`}
            {formType === 7 && `Editer l'image de l'actualité 3`}
            {formType === 8 && `Editer l'image du guide de connexion`}
          </Typography>
          {formType === 1 && <FileForm setFile={sendBannerPhoto} />}

          {[2, 4, 6].includes(formType) && (
            <form onSubmit={handleSubmit(handleNews)}>
              {formType === 2 && (
                <>
                  <TextField
                    label="Titre"
                    type="text"
                    fullWidth={true}
                    sx={{ mb: 2 }}
                    size="small"
                    {...register('news1Title')}
                  />
                  <TextField
                    label="Contenu"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 4 }}
                    size="small"
                    {...register('news1Content')}
                  />
                </>
              )}
              {formType === 1 && <FileForm setFile={sendBannerPhoto} />}
              {formType === 4 && (
                <>
                  <TextField
                    label="Titre"
                    type="text"
                    fullWidth={true}
                    sx={{ mb: 2 }}
                    size="small"
                    {...register('news2Title')}
                  />
                  <TextField
                    label="Contenu"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 4 }}
                    size="small"
                    {...register('news2Content')}
                  />
                </>
              )}
              {formType === 6 && (
                <>
                  <TextField
                    label="Titre"
                    type="text"
                    fullWidth={true}
                    sx={{ mb: 2 }}
                    size="small"
                    {...register('news3Title')}
                  />
                  <TextField
                    label="Contenu"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 4 }}
                    size="small"
                    {...register('news3Content')}
                  />
                </>
              )}
              <Button variant="contained" type="submit">
                Envoyer
              </Button>
            </form>
          )}
          {[3, 5, 7].includes(formType) && <FileForm setFile={handleNewsPhoto} />}

          {formType === 8 && <FileForm setFile={editLoginGuidePhoto} />}
        </Box>
      </Modal>
    </>
  );
};
export default AdminConfig;
