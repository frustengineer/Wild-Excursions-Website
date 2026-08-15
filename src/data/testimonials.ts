import venkat from '../assets/testimonials/venkat.webp';
import rishabh from '../assets/testimonials/rishabh.webp';
import arvind from '../assets/testimonials/arvind.webp';
import vidya from '../assets/testimonials/vidya.webp';
import saurav from '../assets/testimonials/saurav.webp';
import neha from '../assets/testimonials/neha.webp';
import ishan from '../assets/testimonials/ishan.webp';
import dominiqueGroup from '../../travellers_images/traveller-01-group-at-safari-gate.webp';
import dominiqueSunrise from '../../travellers_images/review_Dominique Jacoy/dominique-safari-sunrise.webp';
import dominiqueTiger from '../../travellers_images/review_Dominique Jacoy/dominique-tiger-sighting.webp';
import shabbirTigerResting from '../../travellers_images/review_shabbir/shabbir-tiger-resting.webp';
import shabbirTigerStanding from '../../travellers_images/review_shabbir/shabbir-tiger-standing.webp';
import shabbirTigerForest from '../../travellers_images/review_shabbir/shabbir-tiger-in-forest.webp';
import shabbirTigerTrail from '../../travellers_images/review_shabbir/shabbir-tiger-on-trail.webp';
import shabbirTigerProfile from '../../travellers_images/review_shabbir/shabbir-tiger-profile.webp';
import shabbirDeer from '../../travellers_images/review_shabbir/shabbir-deer-sighting.webp';
import shabbirGaur from '../../travellers_images/review_shabbir/shabbir-gaur-herd.webp';
import ashmiTigerRoad from '../../travellers_images/review_ashmi/ashmi-tiger-on-road.webp';
import ashmiTigerWalking from '../../travellers_images/review_ashmi/ashmi-tiger-walking.webp';
import ashmiGaur from '../../travellers_images/review_ashmi/ashmi-gaur-sighting.webp';
import ashmiTigerBrush from '../../travellers_images/review_ashmi/ashmi-tiger-in-brush.webp';
import ashmiGroup from '../../travellers_images/review_ashmi/ashmi-traveller-group.webp';
import vishalVeranda from '../../travellers_images/review_vishal/vishal-kohka-veranda.webp';
import vishalArtwork from '../../travellers_images/review_vishal/vishal-tribal-artwork.webp';
import vishalGroup from '../../travellers_images/review_vishal/vishal-kohka-group.webp';

const otherReviewPhotos = import.meta.glob('../../travellers_images/review_others/*.webp', {
  eager: true,
  import: 'default',
}) as Record<string, ImageMetadata>;

const photosFor = (reviewer: string) =>
  Object.entries(otherReviewPhotos)
    .filter(([path]) => path.includes(`/review_others/${reviewer}-`))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, image]) => image);

export interface Testimonial {
  name: string;
  city: string;
  avatar: ImageMetadata;
  avatarInitial?: string;
  photos?: ImageMetadata[];
  quote: string;
  tourSlug: string;
  tourName: string;
  rating?: number;
}

export const testimonialsByJungle: Record<string, Testimonial[]> = {
  tadoba: [
    {
      name: 'Dominique Jacoy',
      city: 'Google Review · 1 year ago',
      avatar: dominiqueSunrise,
      avatarInitial: 'D',
      tourSlug: 'tadoba-tiger-safari',
      tourName: 'Tadoba Tiger Safari',
      photos: [dominiqueSunrise, dominiqueGroup, dominiqueTiger],
      rating: 5,
      quote:
        "My group had an amazing experience at Wild Excursions during our 4 day safari! From start to finish, Hardik and his team made sure our trip was top-notch. His drivers and trackers were very talented, and we located many tigers and other cool animals several times. Out of our 7 safaris, we saw tigers on 6 of them. Some of them we saw up to 6 tigers in one safari! The views were incredible, including beautiful sunrises and sunsets, and the food provided was also super tasty. We ate lunch next to a sleeping tiger at least twice. It was an experience I will never forget! Book your safari with Wild Excursions for a once-in-a-lifetime opportunity—you won’t be disappointed.",
    },
    {
      name: 'Shabbir Khan',
      city: 'Local Guide · 11 reviews · 17 photos · Edited 2 years ago',
      avatar: shabbirTigerResting,
      avatarInitial: 'S',
      tourSlug: 'tadoba-tiger-safari',
      tourName: 'Tadoba Tiger Safari',
      photos: [
        shabbirTigerResting,
        shabbirTigerStanding,
        shabbirTigerForest,
        shabbirTigerTrail,
        shabbirTigerProfile,
        shabbirDeer,
        shabbirGaur,
      ],
      rating: 5,
      quote:
        'Amazing, specially Mr Hardip is a guy with a very high level of patience. In addition to his business, he gives personal attention. Everything went very well and was professionally organised. We had a very good experience. Lovely trip for us.',
    },
    {
      name: 'Ashmi Gala',
      city: '2 reviews · 5 photos · 1 year ago',
      avatar: ashmiTigerRoad,
      avatarInitial: 'A',
      tourSlug: 'tadoba-tiger-safari',
      tourName: 'Tadoba Tiger Safari',
      photos: [ashmiTigerRoad, ashmiTigerWalking, ashmiGaur, ashmiTigerBrush, ashmiGroup],
      rating: 4.9,
      quote:
        'We visited Tadoba and had a wonderful experience—an amazing safari witnessing tigers on all three drives, a superb stay with yummy food, and a very good experience overall. Great job, Mr Hardik Patel. Thank you so much.',
    },
    {
      name: 'Vishal Jampekar',
      city: '5 reviews · 6 photos · 2 years ago',
      avatar: vishalGroup,
      avatarInitial: 'V',
      tourSlug: 'tadoba-tiger-safari',
      tourName: 'Tadoba Tiger Safari',
      photos: [vishalVeranda, vishalArtwork, vishalGroup],
      rating: 5,
      quote:
        'The safari arranged by Wild Excursions was really fantastic. Also, the resort—Kohka Wilderness Resort—is nice. The service provided by the resort was good, and the ambience was overwhelming. Thanks to the Wild Excursions team for all the nice arrangements. Special thanks to Hardik.',
    },
    {
      name: 'Venkat Palakodety',
      city: 'Hyderabad',
      avatar: venkat,
      tourSlug: 'tadoba-tiger-safari',
      tourName: 'Tadoba Tiger Safari',
      photos: photosFor('venkat'),
      rating: 5,
      quote:
        "We were fortunate to get in touch Wild Excursions Hardik Ji for our Tadoba visit. We were team of 16 people with quite a few demands in terms of stay, food, conference room and of course sighting of tigers during Safari. Hardik made wonderful arrangements and met all our requirements and we did see 5 tigers. The stay was excellent, food was amazing and arrangements were immaculate. Hardik was in touch with us continuously during our stay in Tadoba. He was flexible and met our on the fly requirements with alacrity. Our overall experience was great and strongly recommend Wild Excursions to take care of safari visits.",
    },
    {
      name: 'Aravind Sivakumar',
      city: 'Mumbai',
      avatar: arvind,
      tourSlug: 'tadoba-tiger-safari',
      tourName: 'Tadoba Tiger Safari',
      photos: photosFor('aravind'),
      rating: 5,
      quote:
        'Extremely well planned Tadoba trip with zero glitches. We had a great time with some amazing sightings. Hardik carefully crafted our safari experience and accompanied us on all safaris. His knowledge of the park and the tigers is amazing and made our trip even more interesting.',
    },
    {
      name: 'Vidya Barde',
      city: 'Nagpur',
      avatar: vidya,
      tourSlug: 'tadoba-tiger-safari',
      tourName: 'Tadoba Tiger Safari',
      photos: photosFor('vidya'),
      rating: 4.9,
      quote:
        'We had a lifetime experience during the Safari at Kesala Ghat. Hardik was very helpful and made sure the process is smooth. He was very thorough with the instructions and made sure there are no impediments during our visit. We would recommend Hardik and would like to avail his service for the next time we book!',
    },
    {
      name: 'Sourav Das',
      city: 'Hyderabad',
      avatar: saurav,
      tourSlug: 'tadoba-tiger-safari',
      tourName: 'Tadoba Tiger Safari',
      photos: photosFor('sourav'),
      rating: 5,
      quote:
        'Everything, starting from stay to safari arrangements and the complete experience I had with Hardik is superb. Bagh Kothi is a lovely resort. Definitely a first preference for those staying at Kolara side. This is my 3rd visit to Tadoba and was the best one. Any day anytime my preference will be to book with Wild Excursions and enjoy the trip hassle free.',
    },
    {
      name: 'Neha Vaidya',
      city: 'Mumbai',
      avatar: neha,
      tourSlug: 'tadoba-tiger-safari',
      tourName: 'Tadoba Tiger Safari',
      photos: photosFor('neha'),
      rating: 5,
      quote:
        'Excellent experience from start to finish. Thank you for organizing an amazing trip, Hardik. You have been great and honest at communicating and suggesting things and very easy to reach at all times. Overall super experience — all thanks to your knowledge and experience we could spot 5 tigers for the first time after doing so many safaris. This was the best and most memorable.',
    },
    {
      name: 'Ishaan Deshmukh',
      city: 'Mumbai',
      avatar: ishan,
      tourSlug: 'tadoba-tiger-safari',
      tourName: 'Tadoba Tiger Safari',
      photos: photosFor('ishaan'),
      rating: 5,
      quote:
        "Booked jungle safari with Wild Excursions during 7th-8th Apr'23. Hardik from Wild Excursions was very helpful throughout the booking, resort selection, cab pick up-drop, and gypsy booking process. Had a wonderful time at Nimbde gate and Kolara gate. Sighted 3 tigers, a bear, a crocodile, along with other regular animals.",
    },
  ],
  'umred-karhandla': [
    {
      name: 'Rishabh Lakhotiya',
      city: 'Nagpur',
      avatar: rishabh,
      tourSlug: 'umred-karhandla-wildlife-safari',
      tourName: 'Umred Karhandla Wildlife Safari',
      rating: 5,
      quote:
        'It was a nice plan organized by Wild Excursions with confirmed sightings of T6 and cubs at Gothangaon, thanks to the knowledge and networks Hardik has. Great energy and positive vibes with a homestay having tasty and homemade, locally popular dishes. If you are planning a visit to UKTR, go with Wild Excursions — as the name suggests, it is clearly a cub-special safari tour. Thanks for this awesome plan.',
    },
  ],
};
