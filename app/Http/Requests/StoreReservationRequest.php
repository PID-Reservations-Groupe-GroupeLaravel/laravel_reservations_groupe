<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'representation_id' => 'required|exists:representations,id',
            'price_id'          => 'required|exists:prices,id',
            'quantity'          => 'required|integer|min:1|max:10',
        ];
    }

    public function messages(): array
    {
        return [
            'representation_id.required' => 'La representation est obligatoire.',
            'representation_id.exists'   => 'Cette representation n existe pas.',
            'price_id.required'          => 'Le tarif est obligatoire.',
            'quantity.min'               => 'La quantite minimum est 1.',
            'quantity.max'               => 'La quantite maximum est 10.',
        ];
    }
}
