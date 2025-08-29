<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Tests\Traits\WithRoles;

abstract class TestCase extends BaseTestCase
{
    use WithRoles;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed default roles for all tests
        $this->seedRoles();
    }
}
