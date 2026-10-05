const savedCount =
  document.getElementById("savedCount");

const cartCount =
  document.getElementById("cartCount");

const profileName =
  document.getElementById("profileName");

const profileEmail =
  document.getElementById("profileEmail");

const detailName =
  document.getElementById("detailName");

const detailEmail =
  document.getElementById("detailEmail");

const avatarLetter =
  document.getElementById("avatarLetter");

const editProfileBtn =
  document.getElementById("editProfileBtn");


function loadProfileData() {

  const savedProducts =
    JSON.parse(
      localStorage.getItem("savedProducts")
    ) || [];

  const cart =
    JSON.parse(
      localStorage.getItem("md_cart")
    ) || [];


  savedCount.textContent =
    savedProducts.length;


  const totalCartItems =
    cart.reduce(
      (total, item) =>
        total + (item.qty || 1),
      0
    );


  cartCount.textContent =
    totalCartItems;


  const storedName =
    localStorage.getItem("profileName");


  const storedEmail =
    localStorage.getItem("profileEmail");


  if (storedName) {

    profileName.textContent =
      storedName;

    detailName.textContent =
      storedName;

    avatarLetter.textContent =
      storedName.charAt(0).toUpperCase();
  }


  if (storedEmail) {

    profileEmail.textContent =
      storedEmail;

    detailEmail.textContent =
      storedEmail;
  }

}


editProfileBtn.addEventListener(
  "click",
  () => {

    const newName =
      prompt(
        "Enter your name:",
        profileName.textContent
      );


    if (newName && newName.trim()) {

      localStorage.setItem(
        "profileName",
        newName.trim()
      );

    }


    const newEmail =
      prompt(
        "Enter your email:",
        profileEmail.textContent
      );


    if (newEmail && newEmail.trim()) {

      localStorage.setItem(
        "profileEmail",
        newEmail.trim()
      );

    }


    loadProfileData();

  }
);


loadProfileData();