import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { listArtists, getArtistById } from "./marketplace.store";

describe("marketplace store", () => {
  it("returns all artists when no city filter", () => {
    const artists = listArtists();
    assert.ok(artists.length >= 3, "should have at least 3 mock artists");
  });

  it("filters artists by cityId", () => {
    const chengdu = listArtists("chengdu");
    const hangzhou = listArtists("hangzhou");

    assert.ok(chengdu.length >= 1);
    assert.ok(hangzhou.length >= 1);

    for (const a of chengdu) {
      assert.equal(a.cityId, "chengdu");
    }
    for (const a of hangzhou) {
      assert.equal(a.cityId, "hangzhou");
    }
  });

  it("finds artist by id", () => {
    const artist = getArtistById("artist_xiaomei");
    assert.ok(artist);
    assert.equal(artist.displayName, "小美");
    assert.equal(artist.cityId, "chengdu");
    assert.ok(artist.servicePackages.length >= 2);
  });

  it("returns undefined for unknown id", () => {
    const artist = getArtistById("nonexistent");
    assert.equal(artist, undefined);
  });

  it("each artist has required fields", () => {
    const artists = listArtists();
    for (const a of artists) {
      assert.ok(a.id);
      assert.ok(a.displayName);
      assert.ok(a.cityId);
      assert.ok(a.avatarUrl);
      assert.ok(a.bio);
      assert.ok(Array.isArray(a.tags));
      assert.ok(Array.isArray(a.scenes));
      assert.ok(typeof a.rating === "number");
      assert.ok(typeof a.reviewCount === "number");
      assert.ok(typeof a.experienceYears === "number");
      assert.ok(typeof a.serviceArea === "number");
      assert.ok(Array.isArray(a.portfolioImages));
      assert.ok(Array.isArray(a.servicePackages));
    }
  });

  it("each service package has required fields", () => {
    const artists = listArtists();
    for (const a of artists) {
      for (const pkg of a.servicePackages) {
        assert.ok(pkg.id);
        assert.equal(pkg.artistId, a.id);
        assert.ok(pkg.scene);
        assert.ok(pkg.name);
        assert.ok(typeof pkg.durationMinutes === "number");
        assert.ok(typeof pkg.priceYuan === "number");
        assert.ok(typeof pkg.includesHair === "boolean");
        assert.ok(pkg.materialsPolicy);
        assert.ok(pkg.description);
      }
    }
  });
});
