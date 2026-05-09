import { useState, useEffect } from 'react';
import useConfigStore from '../../../stores/configStore';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Box, Modal } from '@mui/material';
import FileForm from '../../../components/file_form/FileForm';
import { getModalStyle } from '../../../services/data';
import { deletePhoto } from '../../../stores/fileStore';

const AdminConfig = () => {
  const { config, getConfig, updateConfig } = useConfigStore();
  const [formType, setFormType] = useState(null);

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
            </div>
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
          </Typography>
          {formType === 1 && <FileForm setFile={sendBannerPhoto} />}
        </Box>
      </Modal>
    </>
  );
};
export default AdminConfig;
