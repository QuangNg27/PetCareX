import AddPetForm from './addPet'
import EditPetForm from './editPet'

const PetForm = ({activeForm}) => {
    return (
        <>
            {activeForm == 'add' && <AddPetForm/>}
            {activeForm == 'edit' && <EditPetForm/>}
        </>
    );
}

export default PetForm;