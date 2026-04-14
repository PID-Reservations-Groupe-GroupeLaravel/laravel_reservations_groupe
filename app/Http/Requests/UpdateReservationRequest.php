<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Commit #31 : feat(B2): create UpdateReservationRequest form request
 */
class UpdateReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => 'required|string|in:En attente,Confirmée,Annulée,Payée',
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Le statut est obligatoire.',
            'status.in'       => 'Statut invalide. Valeurs acceptées : En attente, Confirmée, Annulée, Payée.',
        ];
    }
}
