import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

const PetItem = ({ pet, adoptPet, disabled }) => {
  return (
    <div
      className="item"
      style={{ fontFamily: "Montserrat", borderColor: "#804d00" }}
    >
      <div className="image">
        <img src={pet.picture} alt=""></img>
      </div>
      <div className="info-holder">
        <div>
          <b>Name:</b> {pet.name}
        </div>
        <div>
          <b>Age:</b> {pet.age}
        </div>
        <div>
          <b>Breed:</b> {pet.breed}
        </div>
        <div>
          <b>Location:</b> {pet.location}
        </div>
        <div>
          <b>Description:</b> {pet.description}
        </div>
      </div>
      <div className="action-menu">
        <Button
          disabled={disabled}
          onClick={adoptPet}
          className="action-button"
          variant="outlined"
          color="warning"
        >
          <div style={{ fontFamily: "Montserrat", letterSpacing: "2px" }}>
            {disabled ? "Adopted" : "Adopt"}
          </div>
        </Button>
      </div>
    </div>
  );
};

export default PetItem;
