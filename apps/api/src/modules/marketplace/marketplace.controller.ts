import { Controller, Get, NotFoundException, Param, Query } from "@nestjs/common";
import { assertOptionalString, assertString } from "../common/simple-validators";
import { getArtistById, listArtists } from "./marketplace.store";

@Controller("marketplace")
export class MarketplaceController {
  @Get("artists")
  listArtists(@Query("cityId") cityId?: string) {
    const filterCity = assertOptionalString(cityId, "cityId");
    const items = listArtists(filterCity);

    return {
      items,
      total: items.length
    };
  }

  @Get("artists/:id")
  getArtist(@Param("id") id: string) {
    const artist = getArtistById(assertString(id, "id"));

    if (!artist) {
      throw new NotFoundException(`Artist ${id} not found`);
    }

    return artist;
  }
}
