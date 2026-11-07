/**
 * High-definition authentic photographic assets for Vedic and Cultural Guides
 */
import vedicPanchangaImg from './images/vedic_panchanga_guide_1793073686942.jpg';
import nepalFestivalsImg from './images/nepal_festivals_guide_1793073700914.jpg';
import vedicAstrologyImg from './images/vedic_astrology_kundali_1793073714780.jpg';
import shubhaMuhuratImg from './images/shubha_muhurat_guide_1793073735255.jpg';
import bikramSambatImg from './images/bikram_sambat_guide_1793073748107.jpg';
import ayurvedaRitucharyaImg from './images/ayurveda_ritucharya_guide_1793073761749.jpg';
import dashainTikaJamaraImg from './images/dashain_tika_jamara_1793073776958.jpg';
import tiharLightsRangoliImg from './images/tihar_lights_rangoli_1793073792440.jpg';
import chhathPujaNepalImg from './images/chhath_puja_nepal_1793073806947.jpg';
import shivaratriPashupatiImg from './images/shivaratri_pashupati_1793073821427.jpg';

export const GUIDE_PHOTOS = {
  bikramSambat: bikramSambatImg,
  vedicPanchanga: vedicPanchangaImg,
  nepalFestivals: nepalFestivalsImg,
  vedicAstrology: vedicAstrologyImg,
  ayurvedaRitucharya: ayurvedaRitucharyaImg,
  shubhaMuhurat: shubhaMuhuratImg,
  dashainTika: dashainTikaJamaraImg,
  tiharRangoli: tiharLightsRangoliImg,
  chhathPuja: chhathPujaNepalImg,
  shivaratriPashupati: shivaratriPashupatiImg,
};

export const FESTIVAL_PHOTOS: Record<string, string> = {
  dashain: dashainTikaJamaraImg,
  ghatasthapana: '/images/festivals/ghatasthapana.jpg',
  tihar: tiharLightsRangoliImg,
  laxmi_puja: tiharLightsRangoliImg,
  bhai_tika: tiharLightsRangoliImg,
  chhath: chhathPujaNepalImg,
  maha_shivaratri: shivaratriPashupatiImg,
  maghe_sankranti: '/images/festivals/maghe_sankranti.jpg',
  holi: '/images/festivals/holi.jpg',
  buddha_jayanti: '/images/festivals/buddha_jayanti.jpg',
  teej: '/images/festivals/teej.jpg',
  matatirtha: '/images/festivals/matatirtha.jpg',
  kushe_aunsi: '/images/festivals/kushe_aunsi.jpg',
  janai_purnima: '/images/festivals/janai_purnima.jpg',
  indra_jatra: '/images/festivals/indra_jatra.jpg',
  udhauli: '/images/festivals/udhauli.jpg',
  udhauli_yomari: '/images/festivals/yomari_punhi.jpg',
  tamu_lhosar: '/images/festivals/tamu_lhosar.jpg',
  krishna_janmashtami: '/images/festivals/krishna_janmashtami.jpg',
  defaultFestival: nepalFestivalsImg,
};
