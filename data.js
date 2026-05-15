export const paintings = [
  { id: 1, title: "CASCATE DI TIVOLI", year: 1761, artist: "Giovanni Battista Piranesi", location: "Tivoli", image: "/Art-Gallery.github.io/img/image1.png" },
  { id: 2, title: "PORTRAIT OF VINCENT VAN GOGH", year: 1886, artist: "Vincent van Gogh", location: "Paris", image: "/Art-Gallery.github.io/img/image2.png" },
  { id: 3, title: "UNEQUAL MARRIAGE", year: 1862, artist: "Vasily Pukirev", location: "Moscow", image: "/Art-Gallery.github.io/img/image3.png" },
  { id: 4, title: "THE HAPPY VIOLINIST", year: 1624, artist: "Gerard van Honthorst", location: "Amsterdam", image: "/Art-Gallery.github.io/img/image4.png" },
  { id: 5, title: "THE ARCADIAN", year: 1834, artist: "Thomas Cole", location: "New York", image: "/Art-Gallery.github.io/img/image5.png" },
  { id: 6, title: "GOLFO DI NAPOLI", year: 1845, artist: "Anton Sminck van Pitloo", location: "Naples", image: "/Art-Gallery.github.io/img/image6.png" },
];

export const allArtists = [...new Set(paintings.map(p => p.artist))];
export const allLocations = [...new Set(paintings.map(p => p.location))];
