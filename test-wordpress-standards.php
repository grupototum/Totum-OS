<?php
/**
 * Arquivo de teste para validação do padrão WordPress
 */

// ❌ VIOLAÇÃO: Sem espaços, não segue padrão WordPress
$x=1;

// ❌ VIOLAÇÃO: Camel case (WordPress usa snake_case)
function myTestFunction() {
    return true;
}

// ❌ VIOLAÇÃO: Sem espaçamento em operadores
$result=$x+2;

// ❌ VIOLAÇÃO: Array sem espaçamento correto
$array=['a'=>1,'b'=>2];

// ✅ CORRETO: Formato WordPress
$correct_variable = 2;

function correct_function() {
    return false;
}

$correct_result = $correct_variable + 3;

$correct_array = array(
    'a' => 1,
    'b' => 2,
);
