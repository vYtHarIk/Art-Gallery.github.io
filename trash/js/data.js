const paintings = [
  { id: 1, title: "CASCATE DI TIVOLI", year: 1761, artist: "Giovanni Battista Piranesi", location: "Tivoli", image: "img/image 1.png" },
  { id: 2, title: "PORTRAIT OF VINCENT VAN GOGH", year: 1886, artist: "Vincent van Gogh", location: "Paris", image: "img/image 2.png" },
  { id: 3, title: "UNEQUAL MARRIAGE", year: 1862, artist: "Vasily Pukirev", location: "Moscow", image: "img/image 3.png" },
  { id: 4, title: "THE HAPPY VIOLINIST", year: 1624, artist: "Gerard van Honthorst", location: "Amsterdam", image: "img/image 4.png" },
  { id: 5, title: "THE ARCADIAN", year: 1834, artist: "Thomas Cole", location: "New York", image: "img/image 5.png" },
  { id: 6, title: "GOLFO DI NAPOLI", year: 1845, artist: "Anton Sminck van Pitloo", location: "Naples", image: "img/image 6.png" },
];

const allArtists = [...new Set(paintings.map(p => p.artist))];
const allLocations = [...new Set(paintings.map(p => p.location))];

let state = {
  theme: localStorage.getItem('art_gallery_theme') || 'light',
  isMenuOpen: false,
  filters: { artist: '', location: '', yearFrom: '', yearTo: '', search: '' },
  currentPage: 1
};