import {
  BulkDeleteButton,
  Datagrid,
  EditButton,
  FunctionField,
  List,
  NumberField,
  TextField,
  TextInput,
} from 'react-admin';
import { NavLink } from 'react-router-dom';
import PhotoIcon from '@mui/icons-material/Photo';
import PreviewIcon from '@mui/icons-material/Preview';
import { Box, Modal, Tooltip } from '@mui/material';
import { useState } from 'react';
import { getModalStyle } from '../../../../services/data';
import { CustomPagination } from '../common/CustomPagination';
import { TableClassInjector } from '../common/TableClassInjector';
import { ScrollAfterViewInit } from '../common/ScrollAfterViewInit';
import { VideoPhotoEdit } from './VideoPhotoEdit';

export const VideoList = () => {
  const filters = [
    <TextInput source="title" label="Rechercher par titre" alwaysOn key="title" />,
    <TextInput source="actors.name" label="Rechercher par acteur" alwaysOn key="acteur" />,
  ];
  const [videoToModify, setVideoToModify] = useState(null);
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState(null);

  const toggleModal = async (newFormType = null, video = null) => {
    setVideoToModify(video);
    setFormType(newFormType);
    if (newFormType === null) {
      setOpen(false);
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <List
        perPage={20}
        filters={filters}
        sort={{ field: 'id', order: 'DESC' }}
        pagination={<CustomPagination rowsPerPageOptions={[]} />}>
        <ScrollAfterViewInit pageName={'video_list'} />
        <TableClassInjector />
        <Datagrid rowClick={false} bulkActionButtons={<BulkDeleteButton mutationMode="pessimistic" />}>
          <NumberField source="id" />
          <TextField source="title" label="Titre" />
          <FunctionField
            label="Photo"
            render={(record) =>
              record.poster ? (
                <img
                  src={`${process.env.AWS_FILE_PREFIX}${record.poster.imageName}`}
                  alt=""
                  style={{ width: 200, height: 'auto', objectFit: 'cover' }}
                />
              ) : null
            }
          />
          <FunctionField
            source="actors"
            label="Acteurs"
            render={(record) =>
              record.actors.map((actor) => actor.name).map((name, index) => <div key={index}>{name}</div>)
            }
          />
          <FunctionField
            label="Actions"
            render={(record) => (
              <>
                <div className="flex items-center">
                  <EditButton className="me-3 mb-1" />
                  <Tooltip describeChild title="Photo">
                    <PhotoIcon className="me-3 mb-1 cursor-pointer" onClick={() => toggleModal(1, record)} />
                  </Tooltip>
                  <Tooltip describeChild title="Visualiser">
                    <NavLink to={`/video/${record.id}`} className="mb-1" target="_blank">
                      <PreviewIcon />
                    </NavLink>
                  </Tooltip>
                </div>
              </>
            )}
          />
        </Datagrid>
      </List>

      <Modal
        open={open}
        onClose={() => toggleModal()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={getModalStyle(500)}>
          {formType === 1 && (
            <>
              <VideoPhotoEdit video={videoToModify} />
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};
