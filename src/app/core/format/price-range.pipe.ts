import { Pipe, PipeTransform } from '@angular/core';
import { NumberFormats } from './number-formats';

/** A price range in whole credits: `{{ ware.price | priceRange }}` gives "1,200 - 1,800". */
@Pipe({ name: 'priceRange' })
export class PriceRangePipe implements PipeTransform {
	transform(price: { min: number; max: number } | null | undefined): string {
		return price ? `${NumberFormats.whole(price.min)} - ${NumberFormats.whole(price.max)}` : '';
	}
}
